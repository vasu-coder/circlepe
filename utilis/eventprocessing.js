const Inventory = require('../models/inventory');
const Trade =require('../models/trade');
const Cargo = require('../models/cargoD');

const{sendNotification} = require('./notificationSys');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
eventEmitter.on('tradeCreate',async(trade)=>{
    try {
        console.log('Trade created for destination:', trade.destination);

        // Find the cargo shipment with the same destination
        const cargo = await Cargo.findOne({ destination: trade.destination });

        if (!cargo) {
            console.log(`No cargo shipment found for destination ${trade.destination}.`);
            return;
        }

        // Add the trade items to the cargo
        cargo.items.push(...trade.items);
        await cargo.save();

        console.log('Cargo updated with trade items:', cargo._id);

        // Emit event to update the inventory with cargo items
        eventEmitter.emit('cargoUpdated', cargo);
    } catch (err) {
        console.error('Error updating cargo with trade:', err);
    }
})
eventEmitter.on('tradeUpdated', async (trade,emailId) => {
    try {
        const inventory = await Inventory.findOne({ stationId: trade.stationId });

        if (!inventory) {
            console.error('Inventory not found for station:', trade.stationId);
            return;
        }

        // Update inventory based on trade items (this could involve adding/removing items)
        trade.items.forEach(item => {
            const inventoryItem = inventory.items.find(i => i.name === item);
            if (inventoryItem) {
                inventoryItem.quantity -= 1;  // Example logic to deduct item quantity
            } else {
                console.log(`Item ${item} not found in inventory for station`);
            }
        });

        await inventory.save();
        await sendNotification({
            subject: `Critical Event Detected`,
            message: `Shipment ${trade._id} is in ${trade.status}`,
            email: emailId
        });
        console.log('Inventory updated for station:', trade.stationId);
    } catch (err) {
        console.error('Error updating inventory:', err);
    }
});

// Listen for cargo updates and adjust shipment status
eventEmitter.on('cargoUpdated', async (cargo) => {
    try {
        // 1. Log the shipment status and perform different actions based on the status.
        console.log('Shipment status updated for cargo:', cargo._id, 'Status:', cargo.status);
        
        // 2. Check if the shipment is delayed and send a notification.
        if (cargo.status === 'delayed') {
            console.log('Shipment has been delayed:', cargo._id);
            await sendNotification({
                message: `Shipment ${cargo._id} has been delayed. Please take necessary action.`,
                recipients: ['admin@tradesystem.com'] // Hypothetical recipient list
            });
        }

        // 3. Update inventory when the shipment is delivered.
        if (cargo.status === 'delivered') {
            console.log('Processing delivery for shipment:', cargo._id);
            
            // Loop through the items in the shipment and update inventory at the destination.
            for (let item of cargo.items) {
                // Fetch the destination station's inventory
                const inventory = await Inventory.findOne({ stationId: cargo.destination });

                if (inventory) {
                    // Check if the item exists in the inventory, if not add it
                    let existingItem = inventory.items.find(invItem => invItem.name === item.name);

                    if (existingItem) {
                        existingItem.quantity += item.quantity; // Increase the quantity
                    } else {
                        // Add the new item to the inventory
                        inventory.items.push({
                            name: item.name,
                            quantity: item.quantity
                        });
                    }

                    // Save the updated inventory
                    await inventory.save();
                    console.log(`Updated inventory for ${item.name} at ${cargo.destination}`);
                } else {
                    // If no inventory exists for the destination, create a new inventory record
                    const newInventory = new Inventory({
                        stationId: cargo.destination,
                        items: [
                            { name: item.name, quantity: item.quantity }
                        ]
                    });
                    await newInventory.save();
                    console.log(`Created new inventory for ${item.name} at ${cargo.destination}`);
                }
            }

            // Send notification to the destination station
            await sendNotification({
                subject: `Critical Event Detected`,
                message: `Shipment ${cargo._id} has been delivered to ${cargo.destination}. Inventory updated.`,
                email: [`station@${cargo.destination}.com`]
            });

            console.log('Shipment processed successfully for cargo:', cargo._id);
        }

        // 4. Handle any specific business logic for trades related to the cargo.
        const relatedTrades = await Trade.find({ 'items.name': { $in: cargo.items.map(item => item.name) } });

        if (relatedTrades.length > 0) {
            for (let trade of relatedTrades) {
                // Update trade status if necessary
                if (trade.status === 'pending' && cargo.status === 'delivered') {
                    trade.status = 'completed';
                    await trade.save();
                    console.log(`Trade ${trade.transactionId} has been completed due to cargo delivery.`);
                }
            }
        }

    } catch (err) {
        console.error('Error processing cargo update:', err);
    }
});

// Critical event processing for real-time shipment delays
eventEmitter.on('criticalEvent', async (data) => {
    sendNotification({subject:`Critical Event Detected`, message:data.message, email:data.emailId});  
});
module.exports = eventEmitter;