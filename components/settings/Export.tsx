import { exportToPdf } from "@/lib/utils";
import { Button } from "../ui/button";

const exportToPng = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "canvas.png";
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToSvg = () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  // Access the fabric canvas instance from the DOM canvas
  // fabric stores its instance on the canvas element
  const fabricCanvas = (canvas as any).__fabric;

  let svgString: string;
  if (fabricCanvas && typeof fabricCanvas.toSVG === "function") {
    svgString = fabricCanvas.toSVG();
  } else {
    // Fallback: wrap the PNG data in an SVG
    const dataURL = canvas.toDataURL("image/png");
    svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
  <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;
  }

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "canvas.svg";
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const copyToClipboard = async () => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  try {
    const dataURL = canvas.toDataURL("image/png");
    const response = await fetch(dataURL);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};

const buttonClass =
  "w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black";

const Export = () => (
  <div className='flex flex-col gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Export</h3>
    <Button variant='outline' className={buttonClass} onClick={exportToPdf}>
      Export to PDF
    </Button>
    <Button variant='outline' className={buttonClass} onClick={exportToPng}>
      Export to PNG
    </Button>
    <Button variant='outline' className={buttonClass} onClick={exportToSvg}>
      Export to SVG
    </Button>
    <Button variant='outline' className={buttonClass} onClick={copyToClipboard}>
      Copy to Clipboard
    </Button>
  </div>
);

export default Export;
