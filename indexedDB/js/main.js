/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var idbApp = (function() {
  'use strict';
  if(!('indexedDB' in window)){
    console.log('this browser doesnt support indexedDB');
    return;
  }

  var dbPromise = idb.open('couches-n-things', 5, function(upgradeDb) {
    console.log(upgradeDb);
    switch (upgradeDb.oldVersion) {
      case 0:
        // a placeholder case so that the switch block will 
        // execute when the database is first created
        // (oldVersion is 0)
      case 1:
        console.log('Creating the products object store');
        upgradeDb.createObjectStore('products', {keyPath: 'id'});
  
      case 2:
        console.log('Creating a name index');
        var store = upgradeDb.transaction.objectStore('products');
        store.createIndex('name', 'name', {unique: true});
  
      case 3: 
        console.log('creating price and description indexes');
        // const store = upgradeDb.transaction.objectStore('products');
        store.createIndex('price', 'price');
        store.createIndex('description', 'description');
  
      // TODO 5.1 - create an 'orders' object store
      case 4:
        console.log('creating order Object store');
        upgradeDb.createObjectStore('orders', {keyPath: 'id'})
  
    }
  });
  

  function addProducts() {
    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readwrite');
      var store = tx.objectStore('products');
      var items = [
        {
          name: 'Couch',
          id: 'cch-blk-ma',
          price: 499.99,
          color: 'black',
          material: 'mahogany',
          description: 'A very comfy couch',
          quantity: 3
        },
        {
          name: 'Armchair',
          id: 'ac-gr-pin',
          price: 299.99,
          color: 'grey',
          material: 'pine',
          description: 'A plush recliner armchair',
          quantity: 7
        },
        {
          name: 'Stool',
          id: 'st-re-pin',
          price: 59.99,
          color: 'red',
          material: 'pine',
          description: 'A light, high-stool',
          quantity: 3
        },
        {
          name: 'Chair',
          id: 'ch-blu-pin',
          price: 49.99,
          color: 'blue',
          material: 'pine',
          description: 'A plain chair for the kitchen table',
          quantity: 1
        },
        {
          name: 'Dresser',
          id: 'dr-wht-ply',
          price: 399.99,
          color: 'white',
          material: 'plywood',
          description: 'A plain dresser with five drawers',
          quantity: 4
        },
        {
          name: 'Cabinet',
          id: 'ca-brn-ma',
          price: 799.99,
          color: 'brown',
          material: 'mahogany',
          description: 'An intricately-designed, antique cabinet',
          quantity: 11
        }
      ];
      return Promise.all(items.map(function(item) {
          console.log('Adding item: ', item);
          return store.add(item);
        })
      ).catch(function(e) {
        tx.abort();
        console.log(e);
      }).then(function() {
        console.log('All items added successfully!');
      });
    });

  }

  function getByName(key) {
    return dbPromise.then( db => {
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const index = store.index('name');
      console.log(index)
      return index.get(key)
    })

  }

  function displayByName() {
    var key = document.getElementById('name').value;
    if (key === '') {return;}
    var s = '';
    getByName(key).then(function(object) {
      if (!object) {return;}

      s += '<h2>' + object.name + '</h2><p>';
      for (var field in object) {
        s += field + ' = ' + object[field] + '<br/>';
      }
      s += '</p>';

    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }

  function getByPrice() {
    var lower = document.getElementById('priceLower').value;
    var upper = document.getElementById('priceUpper').value;
    var lowerNum = Number(document.getElementById('priceLower').value);
    var upperNum = Number(document.getElementById('priceUpper').value);
    
    if (lower === '' && upper === '') {return;}
    var range;
    if (lower !== '' && upper !== '') {
      range = IDBKeyRange.bound(lowerNum, upperNum);
    } else if (lower === '') {
      range = IDBKeyRange.upperBound(upperNum);
    } else {
      range = IDBKeyRange.lowerBound(lowerNum);
    }
    var s = '';
    dbPromise.then(function(db) {
      var tx = db.transaction('products', 'readonly');
      var store = tx.objectStore('products');
      var index = store.index('price');
      return index.openCursor(range);
    }).then(function showRange(cursor) {
      if (!cursor) {return;}
      console.log('Cursored at:', cursor.value.name);
      s += '<h2>Price - ' + cursor.value.price + '</h2><p>';
      for (var field in cursor.value) {
        s += field + '=' + cursor.value[field] + '<br/>';
      }
      s += '</p>';
      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });    

  }

  function getByDesc() {
    var key = document.getElementById('desc').value;
    if (key === '') {return;}
    var range = IDBKeyRange.only(key);
    var s = '';
    dbPromise.then(function(db) {
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const index = store.index('description');
      return index.openCursor(range);
    }).then( object => {
      if(!object){
        return;
      }
      s += '<h1> ' + object.value.name + '</h1><p>';
      for(let field in object.value){
        s += field + ' = ' + object.value[field] + '<br />'
      }
      s += '</p>';
      return s;
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('results').innerHTML = s;
    });
  }

  function addOrders() {
    const items =  [
      {
        name: 'Cabinet',
        id: 'ca-brn-ma',
        price: 799.99,
        color: 'brown',
        material: 'mahogany',
        description: 'An intricately-designed, antique cabinet',
        quantity: 7
      },
      {
        name: 'Armchair',
        id: 'ac-gr-pin',
        price: 299.99,
        color: 'grey',
        material: 'pine',
        description: 'A plush recliner armchair',
        quantity: 3
      },
      {
        name: 'Couch',
        id: 'cch-blk-ma',
        price: 499.99,
        color: 'black',
        material: 'mahogany',
        description: 'A very comfy couch',
        quantity: 3
      }
    ];
    dbPromise.then(db => {
      const tx = db.transaction('orders', 'readwrite')
      const store = tx.objectStore('orders')
      return Promise.all(items.map(item => {
        console.log('adding item: ', item);
        return store.add(item);
      }))
      .catch(e => {
        console.log('there was an error adding orders', e)
      })
      .then(res => {
        console.log('files added successfully...')
      })
    })
  }

  function showOrders() {
    var s = '';
    dbPromise.then(function(db) {
      const tx = db.transaction('orders', 'readonly');
      const store = tx.objectStore('orders');
      return store.openCursor()
    }).then(function showObj(cursor){
      if(!cursor){
        return;
      }
      s += '<h1>' + cursor.value.name + '</h1><p>';
      for(let field in cursor.value){
        s += field + ' = ' + cursor.value[field] + '<br />';
      }
      s += '</p>';
      return cursor.continue().then(showObj)
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('orders').innerHTML = s;
    });
  }

  function getOrders() {
    return dbPromise.then(db => {
      const tx = db.transaction('orders', 'readonly');
      const store = tx.objectStore('orders');
      return store.getAll();
    })
  }

  function fulfillOrders() {
    getOrders().then(function(orders) {
      return processOrders(orders);
    }).then(function(updatedProducts) {
      updateProductsStore(updatedProducts);
    });
  }

  function processOrders(orders) {
    return dbPromise.then(function(db) {
      var tx = db.transaction('products');
      var store = tx.objectStore('products');
      return Promise.all(
        orders.map(function(order) {
          return store.get(order.id).then(function(product) {
            return decrementQuantity(product, order);
          });
        })
      );
    });

  }

  function decrementQuantity(product, order) {
    return new Promise(function(resolve, reject) {
      var item = product;
      var qtyRemaining = item.quantity - order.quantity;
      if (qtyRemaining < 0) {
        console.log('Not enough ' + product.id + ' left in stock!');
        document.getElementById('receipt').innerHTML =
        '<h3>Not enough ' + product.id + ' left in stock!</h3>';
        throw 'Out of stock!';
      }
      item.quantity = qtyRemaining;
      resolve(item);
    });
  }

  function updateProductsStore(products) {
    dbPromise.then(function(db) {
      const tx = db.transaction('products', 'readwrite');
      const store = tx.objectStore('products');
      return Promise.all(
        products.map(product => {
          console.log('editing product: ', product)
          store.put(product);
          return tx.complete;
        })
      )

      // TODO 5.7 - update the items in the 'products' object store

    }).then(function() {
      console.log('Orders processed successfully!');
      document.getElementById('receipt').innerHTML =
      '<h3>Order processed successfully!</h3>';
    });
  }

  return {
    dbPromise: (dbPromise),
    addProducts: (addProducts),
    getByName: (getByName),
    displayByName: (displayByName),
    getByPrice: (getByPrice),
    getByDesc: (getByDesc),
    addOrders: (addOrders),
    showOrders: (showOrders),
    getOrders: (getOrders),
    fulfillOrders: (fulfillOrders),
    processOrders: (processOrders),
    decrementQuantity: (decrementQuantity),
    updateProductsStore: (updateProductsStore)
  };
})();
