import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { List, ListItem, ListItemText, Button, TextField, Grid, Container } from "@mui/material"; // Import Material-UI components

const RealTimeInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [id, setId] = useState("")

  const socket = io("http://localhost:5001"); // Connect to the server on localhost:5000

  useEffect(() => {
    socket.on("connect", () => console.log("open", socket.id));
    fetchData();
  }, []);

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

  const handleAddProduct = async () => {
    await axios
      .post("http://localhost:5001/add", {
        name: productName,
        quantity: productQuantity,
        price: productPrice,
      })
      .then((response) => {
        // Emit "addProduct" event to server
        socket.emit("addProduct", response.status);
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  const handleDeleteProduct = async () => {
    await axios
      .delete(`http://localhost:5001/delete/${id}`)
      .then(() => {
        // Emit "deleteProduct" event to server
        socket.emit('deleteProduct', { name: productName });
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const handleUpdateProduct = async () => {
    await axios
      .put(`http://localhost:5001/update/${id}`, {
        name: productName,
        quantity: productQuantity,
        price: productPrice,
      })
      .then(() => {
        // Emit "updateProduct" event to server
        socket.emit("updateProduct", { name: productName });
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleListItemClick = (id) => {
    setId(id)
    console.log("Clicked row:", id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
        <h1>Real-time Inventory</h1>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <List>
            {inventory?.map((item) => (
              <ListItem
                key={item.name}
                onClick={() => handleListItemClick(item._id)} // Add onClick event handler to ListItem
              >
                <ListItemText
                  primary={`${item.name} - Quantity: ${item.quantity} - Price: ${item.price}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "10px" , textAlign: "center"}}>
        <Container>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField

              variant="outlined"
              type="number"
              value={productQuantity}
              onChange={e => setProductQuantity(parseInt(e.target.value))}
              label="Product Quantity"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              type="number"
              value={productPrice}
              onChange={e => setProductPrice(parseFloat(e.target.value))}
              label="Product Price"
            />
          </Grid>
        </Grid>
        </Container>


        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", textAlign: "center", marginTop: "10px" }}>
          <Button variant="contained" onClick={handleAddProduct} style={{ marginLeft: "10px", marginRight: "10px" }}>Add Product</Button>
          <Button variant="contained" onClick={handleDeleteProduct} style={{ marginLeft: "10px", marginRight: "10px" }}>Delete Product</Button>
          <Button variant="contained" onClick={handleUpdateProduct} style={{ marginLeft: "10px", marginRight: "10px" }}>Update Product</Button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeInventory;
