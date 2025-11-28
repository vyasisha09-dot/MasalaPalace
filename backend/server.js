const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIXED: Serve images from frontend folder
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (err) {}
}

// ✅ FIXED: Menu with YOUR JPG images
const sampleMenu = [
    { _id: 1, name: 'Butter Chicken', category: 'Main Course', price: 250, description: 'Creamy tomato butter chicken', image: 'butter-chicken.jpg', available: true },
    { _id: 2, name: 'Chicken Biryani', category: 'Rice', price: 300, description: 'Aromatic chicken biryani', image: 'biryani.jpg', available: true },
    { _id: 3, name: 'Butter Naan', category: 'Bread', price: 80, description: 'Soft butter naan', image: 'naan.jpg', available: true },
    { _id: 4, name: 'Paneer Tikka', category: 'Starters', price: 220, description: 'Grilled paneer tikka', image: 'paneer-tikka.jpg', available: true },
    { _id: 5, name: 'Mango Lassi', category: 'Drinks', price: 60, description: 'Sweet mango lassi', image: 'lassi.jpg', available: true },
    { _id: 6, name: 'Dal Makhani', category: 'Main Course', price: 200, description: 'Creamy black lentils', image: 'dal-makhani.jpg', available: true },
    { _id: 7, name: 'Raita', category: 'Sides', price: 50, description: 'Yogurt with cucumber', image: 'raita.jpg', available: true }
];

// API Routes
app.get('/api/menu', async (req, res) => {
    try {
        await ensureDataDir();
        let menu;
        try {
            const data = await fs.readFile(MENU_FILE, 'utf8');
            menu = JSON.parse(data);
        } catch {
            menu = sampleMenu;
            await fs.writeFile(MENU_FILE, JSON.stringify(menu, null, 2));
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        await ensureDataDir();
        let orders = [];
        try {
            const data = await fs.readFile(ORDERS_FILE, 'utf8');
            orders = JSON.parse(data);
        } catch {
            await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        await ensureDataDir();
        const newOrder = {
            _id: Date.now().toString(),
            ...req.body,
            date: new Date().toISOString(),
            status: req.body.status || 'Pending'
        };
        
        let orders = [];
        try {
            const data = await fs.readFile(ORDERS_FILE, 'utf8');
            orders = JSON.parse(data);
        } catch {
            orders = [];
        }
        
        orders.unshift(newOrder);
        await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
        
        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log('✅ Server running: http://localhost:5000');
    console.log('✅ Images served from: http://localhost:5000/images/');
});



// const express = require('express');
// const cors = require('cors');
// const fs = require('fs').promises;
// const path = require('C:\Users\vyasi\OneDrive\Desktop\foodcourt\frontend\images');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/images', express.static(path.join(__dirname, '../frontend/images')));


// const DATA_DIR = path.join(__dirname, 'data');
// const MENU_FILE = path.join(DATA_DIR, 'menu.json');
// const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// // Ensure data directory exists
// async function ensureDataDir() {
//     try {
//         await fs.mkdir(DATA_DIR, { recursive: true });
//     } catch (err) {}
// }

// // Sample Indian menu data
// const sampleMenu = [
//   { _id: 1, name: 'Butter Chicken', category: 'Main Course', price: 250, description: 'Creamy tomato butter chicken', image: 'butter-chicken.png', available: true },
//   { _id: 2, name: 'Chicken Biryani', category: 'Rice', price: 300, description: 'Aromatic chicken biryani', image: 'biryani.png', available: true },
//   { _id: 3, name: 'Butter Naan', category: 'Bread', price: 80, description: 'Soft butter naan', image: 'naan.png', available: true },
//   { _id: 4, name: 'Paneer Tikka', category: 'Starters', price: 220, description: 'Grilled paneer tikka', image: 'paneer-tikka.png', available: true },
//   { _id: 5, name: 'Mango Lassi', category: 'Drinks', price: 60, description: 'Sweet mango lassi', image: 'lassi.png', available: true },
//   { _id: 6, name: 'Dal Makhani', category: 'Main Course', price: 200, description: 'Creamy black lentils', image: 'dal-makhani.png', available: true },
//   { _id: 7, name: 'Raita', category: 'Sides', price: 50, description: 'Yogurt with cucumber', image: 'raita.png', available: true }
// ];


// // API Routes
// app.get('/api/menu', async (req, res) => {
//     try {
//         await ensureDataDir();
//         let menu;
//         try {
//             const data = await fs.readFile(MENU_FILE, 'utf8');
//             menu = JSON.parse(data);
//         } catch {
//             menu = sampleMenu;
//             await fs.writeFile(MENU_FILE, JSON.stringify(menu, null, 2));
//         }
//         res.json(menu);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/api/orders', async (req, res) => {
//     try {
//         await ensureDataDir();
//         let orders = [];
//         try {
//             const data = await fs.readFile(ORDERS_FILE, 'utf8');
//             orders = JSON.parse(data);
//         } catch {
//             await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2));
//         }
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/api/orders', async (req, res) => {
//     try {
//         await ensureDataDir();
//         const newOrder = {
//             _id: Date.now().toString(),
//             ...req.body,
//             date: new Date().toISOString()
//         };
        
//         let orders = [];
//         try {
//             const data = await fs.readFile(ORDERS_FILE, 'utf8');
//             orders = JSON.parse(data);
//         } catch {}
        
//         orders.unshift(newOrder);
//         await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
        
//         res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(5000, () => {
//     console.log('Server running on http://localhost:5000');
// });
