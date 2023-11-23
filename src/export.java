import java.util.*;
import java.io.FileWriter;
import java.io.IOException;

import java.io.File;
import java.io.PrintWriter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;


public class export{

    public static void to_csv(String path, HashMap<String, Double> dico_frequence) throws IOException {

        FileWriter writer = new FileWriter(path, true); // True = Append to file, false = Overwrite

        String eol = System.getProperty("line.separator");

        writer.append("tag;weight")
                .append(eol);

        for (Map.Entry<String, Double> entry : dico_frequence.entrySet()) {
            writer.append(entry.getKey())
                    .append(';')
                    .append(String.format("%.6f", entry.getValue()).replace(',', '.'))

                    .append(eol);
        }
        writer.append(";");
        writer.close();
    }

    public static void to_txt(String pdf_name)throws IOException{
        
        //Instancier un nouveau fichier où on met le pdf
        File file = new File("src/Textes/"+pdf_name+".pdf");
        PDDocument document = Loader.loadPDF(file);

        //On instancie la class PDFTextStripper
        PDFTextStripper pdfStripper = new PDFTextStripper();

        //Le texte extrait on le place dans un string
        String text = pdfStripper.getText(document);
        
        //On converti le string en un fichier txt
        PrintWriter out = new PrintWriter("src/Textes/"+pdf_name+".txt");
        out.println(text);

        //On ferme les documents
        out.close();
        document.close();
   
    }   
}