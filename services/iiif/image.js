const axios = require("axios");

const getService = async (service, preferredWidth = 1000) => {
  if (service.hasOwnProperty("@id")) {
    try {
      const response = await axios.get(`${service["@id"]}/info.json`);
      const { width, height } = response.data.sizes.reduce((a, b) => {
        return Math.abs(b.width - preferredWidth) <
          Math.abs(a.width - preferredWidth)
          ? b
          : a;
      });
      return {
        id: `${service["@id"]}/full/${width},${height}/0/default.jpg`,
        width: width,
        height: height,
      };
    } catch (err) {
      console.log(err.response.status);
      return {};
    }
  }
};

exports.getRepresentativeImage = async (resource, preferredSize = 1000) => {
  //console.log("🚀 ~ file: image.js:26 ~ exports.getRepresentativeImage= ~ resource", resource)
  const firstCanvas = resource.items[0];
  //console.log("🚀 ~ file: image.js:28 ~ exports.getRepresentativeImage= ~ firstCanvas", firstCanvas)

  const firstCanvasService = firstCanvas.items?.[0].items?.[0].body?.service?.[0] ? await getService(
    firstCanvas.body.service[0],
    preferredSize
  ) : null;
  if (firstCanvasService) {
    return [
      {
        id: firstCanvasService.id,
        type: "Image",
        format: "image/jpeg",
        width: firstCanvasService.width,
        height: firstCanvasService.height,
      },
    ];
  } else {
    return firstCanvas.thumbnail ? firstCanvas.thumbnail : [];
  }
};