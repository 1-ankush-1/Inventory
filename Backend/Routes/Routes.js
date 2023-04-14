import { Product } from "../Models/Schemas.js"

//AllProduct
export const getAll = async (req, res) => {
    try {
        const data = await Product.find();
        if (data) {
            return res.status(200).json({ status: false, data });
        }
        return res.status(404).json({ status: false });
    } catch (err) {
        console.log("getAll", err)
    }
}

//OneProduct
export const getOne = async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await Product.find(_id);
        if (data) {
            return res.status(200).json({ status: false, data });
        }
        return res.status(404).json({ status: false });
    } catch (err) {
        console.log("getAll", err)
    }
}

//addProduct
export const add = async (req, res, io) => {

    try {
        const { name, quantity, price } = req.body;
        const product = new Product({
            name,
            quantity,
            price,
        })
        await product.save().then((result) => {
            if (!result) {
                return res.status(500).json({ status: false })
            } else {
                //send data that you want to brodcast(add,delete,update) in all client
                io.emit("addProduct", result)
                return res.status(200).json({ status: result.name })
            }
        }).catch(err => {
            console.error('Error in saving product:', err);
        });
    } catch (err) {
        console.log("add", err)
        return res.status(500).json({ status: false })
    }
}

//updateProduct
export const update = async (req, res, io) => {

    const { name, quantity, price } = req.body;
    const _id = req.params.id;
    await Product.findByIdAndUpdate(_id).then((result) => {
        if (!result) {
            return res.status(404).json({ status: false })
        }
        result.name = name;
        result.quantity = quantity;
        result.price = price;
        console.log(result)
        result.save().then((result) => {
            if (!result) {
                return res.status(500).json({ status: false })
            } else {
                io.emit("updateProduct", result);
                return res.status(200).json({ status: result.name })
            }
        }).catch(err => {
            console.error('Error in updating product:', err);
        });
    })
}

//removeProduct
export const remove = async (req, res, io) => {

    const _id = req.params.id;
    await Product.findByIdAndRemove(_id).then((result) => {
        if (!result) {
            return res.status(404).json({ status: false })
        } else {
            io.emit("deleteProduct", result);
            return res.status(200).json({status: result.name })
        }
    }).catch((err) => {
        console.log("add", err);
        return res.status(500).json({ status: false })
    });
}