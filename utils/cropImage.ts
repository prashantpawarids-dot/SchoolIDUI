export default function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
) {
  const canvas = document.createElement("canvas")
  const image = new Image()
  image.src = imageSrc

  return new Promise<string>((resolve, reject) => {
    image.onload = () => {
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject("Canvas context not found")

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      resolve(canvas.toDataURL("image/jpeg"))
    }
    image.onerror = reject
  })
}
