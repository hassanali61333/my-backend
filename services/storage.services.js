import ImageKit from "@imagekit/nodejs";


const imagekit = new ImageKit({
  privateKey: "private_cnIyvpe/GKK+9eGciyu4el0Yql8=",
});

const uploadImage = async (buffer,name) => {
  const result = await imagekit.files.upload({
    file: buffer.toString("base64"),
    fileName: "image.jpg",
    orignalName: name

  });

  return result;
};

export default uploadImage;
