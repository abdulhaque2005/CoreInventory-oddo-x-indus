const fs = require('fs');

const payload = {
  stock: [{ product: "Test", quantity: 10, category: "Widgets" }],
  anomalies: [],
  moveHistory: []
};

fetch('http://localhost:3000/api/ai/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(res => res.text())
.then(text => {
  fs.writeFileSync('error_dump.log', text);
  console.log('Dumped to error_dump.log');
})
.catch(err => console.error('ERROR:', err));
