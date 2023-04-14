import { Product } from "../Models/Schemas.js"

//getAll
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

//getOne
export const getOne = async (req, res) => {
    try {
        const _id  = req.params.id;
        const data = await Product.find(_id);
        if (data) {
            return res.status(200).json({ status: false, data });
        }
        return res.status(404).json({ status: false });
    } catch (err) {
        console.log("getAll", err)
    }
}

//add
export const add = async (req, res,io) => {
    console.log(req.body)
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
                io.emit("addProduct", result)
                return res.status(200).json({ status: `added ${result.name}` })
            }
        }).catch(err => {
            console.error('Error in saving product:', err);
        });
    } catch (err) {
        console.log("add", err)
        return res.status(500).json({ status: false })
    }
}

//update
export const update = async (req, res,io) => {
    try {
        const { name, quantity, price } = req.body;
        const _id  = req.params.id;
        await Product.findByIdAndUpdate(_id).then((err, result) => {
            if (err) {
                console.log(err)
            } else {
                if (!result) {
                    return res.status(404).json({ status: false })
                }
                result.name = name;
                result.quantity = quantity;
                result.price = price;
                result.save().then((result) => {
                    if (!result) {
                        return res.status(500).json({ status: false })
                    } else {
                        io.emit("updateProduct", result);
                        return res.status(200).json({ status: `updated ${result.name}`  })
                    }
                }).catch(err => {
                    console.error('Error in updating product:', err);
                });
            }
        });
    } catch (err) {
        console.log("add", err)
        return res.status(500).json({ status: false })
    }
}

//remove
export const remove = async (req, res,io) => {
    try {
        const _id  = req.params.id;
        await Product.findByIdAndRemove(_id).then((err, result) => {
            if (err) {
                console.log(err)
            } else {
                if (!result) {
                    return res.status(404).json({ status: false })
                } else {
                    io.emit("deleteProduct", result);
                    return res.status(200).json({ status: `removed ${result.name}` })
                }
            }
        });
    } catch (err) {
        console.log("add", err);
        return res.status(500).json({ status: false })
    }

}