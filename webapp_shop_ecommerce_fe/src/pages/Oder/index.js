import HexToColorName from "~/ultils/HexToColorName";
function Oder() {
    const colorNameResult1 = HexToColorName("#6f8cb6");
  const colorNameResult2 = HexToColorName("#ff0000");
    return ( 
        <h1>Oder
             <p>Tên màu của #ffff: {colorNameResult1}</p>
      <p>Tên màu của #ff0000: {colorNameResult2}</p>
        </h1>
     );
}

export default Oder;

