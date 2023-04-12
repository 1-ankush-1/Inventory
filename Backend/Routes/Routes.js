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
        const { id } = req.params;
        const data = await Product.find(id);
        if (data) {
            return res.status(200).json({ status: false, data });
        }
        return res.status(404).json({ status: false });
    } catch (err) {
        console.log("getAll", err)
    }
}

//add
export const add = async (req, res) => {
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
                return res.status(200).json({ status: true })
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
export const update = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const { id } = req.params;
        await Product.findByIdAndUpdate(id).then((err, result) => {
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
                        return res.status(200).json({ status: true })
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
export const remove = async (req, res) => {
    try {
        const id = req.params;
        await Product.findByIdAndRemove(id).then((err, result) => {
            if (err) {
                console.log(err)
            } else {
                if (!result) {
                    return res.status(404).json({ status: false })
                } else {
                    return res.status(200).json({ status: true })
                }
            }
        });
    } catch (err) {
        console.log("add", err);
        return res.status(500).json({ status: false })
    }

}