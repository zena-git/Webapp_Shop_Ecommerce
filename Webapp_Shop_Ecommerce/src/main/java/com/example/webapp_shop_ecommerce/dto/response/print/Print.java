package com.example.webapp_shop_ecommerce.dto.response.print;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.awt.print.PrinterException;

public class Print implements Printable {
    private BufferedImage image;

    public Print(BufferedImage image) {
        this.image = image;
    }

    // This is the only method you must implement for the `Printable` interface.
    // You're choosing to use the newer Graphics2D class instead.
    public int print(Graphics graphicsOld, PageFormat pageFormat, int pageIndex) throws PrinterException {
        Graphics2D graphics = (Graphics2D) graphicsOld;

        // Here, your X and Y could be 0, but you're following what's set in `PageFormat` instead. Then you use its width and height to draw the image over the whole page.
        graphics.drawImage(image, (int) pageFormat.getImageableX(), (int) pageFormat.getImageableY(), (int) pageFormat.getWidth(), (int) pageFormat.getHeight(), null);

        return PAGE_EXISTS;
    }
}
