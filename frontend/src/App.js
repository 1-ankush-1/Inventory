import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import {  Button, TextField, Grid, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"; // Import Material-UI components

const RealTimeInventory = () => {
  //All states
  const [inventory, setInventory] = useState([]);
  const [id, setId] = useState("");
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [notification, setNotification] = useState(null);

  // Connect to the server on localhost:5001
  const socket = io("http://localhost:5001");

  useEffect(() => {
    // Listen for event from server - Acc to event change data of inventory
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });
    socket.on('addProduct', (data) => {
      setInventory((products) => [...products, data]);
      setNotification(`Product added: ${data.name}`);
    });
    socket.on('deleteProduct', (data) => {
      setInventory((products) => products.filter((product) => product._id !== data._id));
      setNotification(`Product deleted: ${data.name}`);
    });
    socket.on('updateProduct', (data) => {
      setInventory((products) =>
        products.map((product) => (product._id === data._id ? data : product))
      );
      setNotification(`Product updated: ${data.name}`);
    });

    //fetching all data
    fetchData();

    //Clean up the event listener when the component unmounts
    return () => {
      socket.off('connect');
      socket.off('addProduct');
      socket.off('deleteProduct');
      socket.off('updateProduct');
    };
  }, []);

  //another useEffect for notification . automatically close after 3 sec
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  //fetchAll Product
  const fetchData = async () => {
    await axios
      .get("http://localhost:5001/getAll")
      .then((response) => {
        if (response) {
          setInventory(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  //Onclick event of Add
  const handleAddProduct = async () => {
    await axios
      .post("http://localhost:5001/add", {
        name: productName,
        quantity: productQuantity,
        price: productPrice,
      })
      .then(() => {
        fetchData();
        setProductName("")
        setProductQuantity(0)
        setProductPrice(0)
        setId("")
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  //onclick event of Delete
  const handleDeleteProduct = async () => {
    await axios
      .delete(`http://localhost:5001/delete/${id}`)
      .then(() => {
        fetchData();
        setProductName("")
        setProductQuantity(0)
        setProductPrice(0)
        setId("")
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };


  //onclick event of update
  const handleUpdateProduct = async () => {
    await axios
      .put(`http://localhost:5001/update/${id}`, {
        name: productName,
        quantity: productQuantity,
        price: productPrice,
      })
      .then(() => {
        fetchData();
        setProductName("")
        setProductQuantity(0)
        setProductPrice(0)
        setId("")
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  //setting fetch data in states
  const handleListItemClick = (item) => {
    handleRowClick(item);
    setId(item._id)
    setProductName(item.name)
    setProductQuantity(item.quantity)
    setProductPrice(item.price)
  };

  //create notification component
  const Notification = ({ message, onClose }) => {
    return (
      <div style={{ padding: '10px', backgroundColor: '#e6e6e6', borderRadius: '5px' ,display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"}}>
        <Typography>{message}</Typography>
        <Button variant="contained" onClick={onClose} style={{  marginTop: "10px", background: "lightblue", color: "black" }} >Cancel</Button>
      </div>
    );
  };

  //change row color of selected row
  const [selectedRow, setSelectedRow] = useState(null);
  const handleRowClick = (item) => {
    setSelectedRow(item.name);
  };


  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
     
      {/*show notification on event*/}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 >Real-time Inventory</h1>
        {/*Inventory*/}
        <div style={{ width: 'fit-content', margin: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory?.map((item) => (
                <TableRow
                  key={item.name}
                  onClick={() => handleListItemClick(item)}
                  style={{ cursor: "pointer", backgroundColor: item.name === selectedRow ? 'lightblue' : 'white', }}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>


      {/*input field to get data*/}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "20px", textAlign: "center" }}>

        <Container>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4} >
              <TextField
             
                variant="filled"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                label="Product Name"

              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                
                variant="filled"
                type="number"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
                label="Product Quantity"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="filled"
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                label="Product Price"
              />
            </Grid>
          </Grid>
        </Container>

        {/*button to perform action*/}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "center", marginTop: "10px" }}>
          <Button variant="contained" onClick={handleAddProduct} style={{ marginLeft: "10px", marginRight: "10px", background: "lightblue", color: "black" }}>Add Product</Button>
          <Button variant="contained" onClick={handleDeleteProduct} style={{ marginLeft: "10px", marginRight: "10px", background: "lightblue", color: "black" }}>Delete Product</Button>
          <Button variant="contained" onClick={handleUpdateProduct} style={{ marginLeft: "10px", marginRight: "10px", background: "lightblue", color: "black" }}>Update Product</Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeInventory;
