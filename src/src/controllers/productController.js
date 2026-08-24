
import productmodel from "../models/productModel.js"
import uploadImage from "../services/storage.services.js"




//=======================================Add Product===============================================
export const createProduct = async (req, res) => {
  console.log("BODY:", req.body)
console.log("FILE:", req.file)
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const imageResult = await uploadImage(
      req.file.buffer,
      req.file.originalname
    );
const response = await productmodel.create({
  name: req.body.name,
  image: imageResult.url,
  discountedPrice: req.body.discountedPrice,  
  originalPrice: req.body.originalPrice,       
  category: req.body.category,
  shortDescription: req.body.shortDescription,
  stock: req.body.stock,
  description: JSON.parse(req.body.description),
  feature: JSON.parse(req.body.feature)
});

    res.json({
      success: true,
      message: "Product posted successfully",
      data: response
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
//========================================Get Product========================================
export const  getProduct =async(req,res)=>{
try{
const response = await productmodel.find({});
console.log("Products:", response);
res.json({
  success:true,
  message:"prodcut get successfully",
  data:response
})
}
catch (err) {
console.log(err)
}
}
//===================================================Update Prodcut======================================

export const updateProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const { name, discountedPrice, originalPrice, category , description , stock, shortDescription, feature  } = req.body;

    let updateData = { name, discountedPrice, originalPrice, category , description , stock, shortDescription, feature };

    if (req.file) {
      try {
        const imageResult = await uploadImage(req.file.buffer, req.file.originalname);
        updateData.image = imageResult.url;
      } catch (imgErr) {
        return res.status(400).json({ success: false, message: "Image upload failed" });
      }
    }

    const updated = await productmodel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//=========================================DElLETE PRORDUCT==========================================
export const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await productmodel.deleteOne({ _id: id });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//===============================================stock decrese=========================================

export const stockDercrese = async (req, res) => {
  const items = req.body;
console.log(items)
  try {

    for (let i = 0; i < items.length; i++) {
      const element = items[i];

      const exist = await productmodel.findById(element.productId);

      if (!exist) {
        return res.status(404).json({
          success: false,
          message: "product not found",
        });
      }

      if (exist.stock < element.quantity) {
        return res.status(400).json({
          success: false,
          message: "Stock not enough",
        });
      }

      exist.stock = exist.stock - element.quantity;
      await exist.save();
    }

    return res.json({
      success: true,
      message: "All stock updated successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//==============================================stock incrses============================================
export const stockIncrease = async (req, res) => {

  const id = req.params.id;
  const qty= req.body.qty
  try {
    const product = await productmodel.findById(id);
    console.log(product)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data:product
      });
    }

    
    
    // Stock increment (optional: max limit check laga sakte ho)
    else if(product && product.stock <= product.stock){
      product.stock = product.stock + 1;
    await product.save();

    return res.json({
      success: true,
      stock: product.stock,
      message: "Stock increased successfully",
      data:product
    });

    }
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};