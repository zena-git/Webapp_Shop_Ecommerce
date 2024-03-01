import colorName from 'color-name';

const hexToColorName = (hex) => {
  // Chuyển đổi HEX sang RGB
  const hexWithoutHash = hex.replace('#', '');
  const rgb = {
    r: parseInt(hexWithoutHash.substring(0, 2), 16),
    g: parseInt(hexWithoutHash.substring(2, 4), 16),
    b: parseInt(hexWithoutHash.substring(4, 6), 16),
  };

  // Tìm tên màu tương ứng trong color-name với ngưỡng chấp nhận
  let closestColor = null;
  let minColorDiff = Infinity;

  for (const color in colorName) {
    const colorDiff =
      Math.abs(colorName[color][0] - rgb.r) +
      Math.abs(colorName[color][1] - rgb.g) +
      Math.abs(colorName[color][2] - rgb.b);

    if (colorDiff < minColorDiff) {
      minColorDiff = colorDiff;
      closestColor = color;
    }
  }

  // Kiểm tra xem sự khác biệt có nằm trong ngưỡng chấp nhận không
  const threshold = 765; // Điều chỉnh ngưỡng theo nhu cầu
  if (minColorDiff < threshold) {
    return closestColor;
  }

  return hex;
};

export default hexToColorName;
