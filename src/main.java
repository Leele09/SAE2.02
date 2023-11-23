import java.util.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class main {

    /**
     * Méthode qui convertie un texte dans un tableau en séparant chaque mot.
     * 
     * Prend aussi en charge les cas de majuscules
     * 
     * @return Liste de string
     */
    public static List<String> string_to_List(String text, Corrector corrector) {

        // Séparation des mots par des espaces
        String[] liste = text.split("\\s+");

        // Convertion de notre liste en ArrayListe
        List<String> converted_liste = new ArrayList<String>(Arrays.asList(liste));
        // ON MET EN MININUSCULE LA PREMIERE LETTRE
        for (int i = 0; i < converted_liste.size(); i++) {
            // On verifie que le mot n'est pas vide
            if (converted_liste.get(i).length() != 0) {
                // On verifie que la 1ere lettre fait partie de l'alphabet majuscule et aussi
                // pour eviter les accents
                if (Arrays.asList('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
                        'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z').contains(converted_liste.get(i).charAt(0))) {
                    // Cas où il s'agit d'un chiffre romain
                    if (converted_liste.get(i).charAt(0) == 'I' || converted_liste.get(i).charAt(0) == 'V'
                            || converted_liste.get(i).charAt(0) == 'X') {
                        // Si la lettre qui precede n'est pas une maj alors on modifie
                        if (!Arrays.asList('I', 'V', 'X')
                                .contains(converted_liste.get(i).charAt(converted_liste.get(i).length() - 1))) {
                            converted_liste = corrector.upper_to_lower(converted_liste, i);
                        }
                    }
                    // On met en miniscule la 1ere lettre
                    else {
                        converted_liste = corrector.upper_to_lower(converted_liste, i);
                    }
                }
            }
        }
        return converted_liste;
    }

    /**
     * Méthode qui convertie un tableau en hashmap (dictionnaire) avec comme clé le
     * mot
     * et en valeur sa fréquence
     * 
     * @return HashMap<String, double>
     */

    public static HashMap<String, Double> List_to_dico(List<String> lst) {

        HashSet<String> liste_sans_doublons = new HashSet<>(lst);
        HashMap<String, Double> dico_frequence = new HashMap<>();
        LinkedHashMap<String, Double> sortedMap = new LinkedHashMap<>();
        ArrayList<Double> list = new ArrayList<>();
        ArrayList<Double> lst_n_first_element = new ArrayList<>();

        // Création d'un dico avec les mots avec en valeur leurs fréquence
        for (String mot : liste_sans_doublons) {
            double frequence = (double) Collections.frequency(lst, mot) / lst.size();
            dico_frequence.put(mot, frequence);
        }

        // On ajoute les valeurs dans une autre liste
        for (Map.Entry<String, Double> entry : dico_frequence.entrySet()) {
            list.add(entry.getValue());
        }

        // On trie et reverse la liste
        Collections.sort(list);
        Collections.reverse(list);

        // On ne prend que les n premiers
        for (int i = 0; i < list.size(); i++) {
            lst_n_first_element.add(list.get(i));
        }

        // On le remet sous forme d'un dico clé/valeur
        for (Double num : lst_n_first_element) {
            for (java.util.Map.Entry<String, Double> entry : dico_frequence.entrySet()) {
                if (entry.getValue().equals(num)) {
                    sortedMap.put(entry.getKey(), num);
                }
            }
        }
        return sortedMap;
    }

    public static void main(String[] args) throws Exception {

        String pdf_civil = "code_civil";
        String pdf_penal = "code_penal";
        //String pdf_famille = "code_famille";
        //String pdf_travail = "code_travail";
        // RECUPERATION DES FICHIERS PDF
        System.out.println("RECUPERATION ...");

        // On export en .txt
        export.to_txt(pdf_penal);
        export.to_txt(pdf_civil);
         //export.to_txt(pdf_famille);
         //export.to_txt(pdf_travail);

        // LECTURE
        System.out.println("LECTURE ...");

        // On lie les fichiers txt
        String text_penal = new String(Files.readAllBytes(Paths.get("src/Textes/" + pdf_penal + ".txt")));
        String text_civil = new String(Files.readAllBytes(Paths.get("src/Textes/" + pdf_civil + ".txt")));
         //String text_famille = new String(Files.readAllBytes(Paths.get("src/Textes/"+pdf_famille+".txt")),"UTF-8");
         //String text_travail = new String(Files.readAllBytes(Paths.get("src/Textes/"+pdf_travail+".txt")),"UTF-8");

        // NETTOYAGE
        System.out.println("NETTOYAGE ...");

        // Liste des élément à retirer / modifier
        List<List<String>> char_to_delete = new ArrayList<>();
        List<String> useless = Arrays.asList("le", "la", "les", "un", "une", "des", "à", "est", "et",
                "au", "aux", "de", "du", "dans", "leurs", "leur", "ou", "etc",
                "et", "ces", "ce", "ceux", "ceux-ci", "celles", "ça", "je", "tu", "il", "on", "nous", "vous", "ils",
                "elle", "elles",
                "sa", "sont", "tel", "tels", "telles", "sans", "en", "ni", "par", "si", "son", "pour", "dont",
                "celui", "cette", "cet", "pas", "celle", "ci",
                "ne", "sur", "que", "qui", "quoi", "se", "ses", "quel", "lui", "laquelle", "lequel", "lesquels",
                "duquel", "selon",
                "tous", "toute", "toutes", "tout", "i", "y", "ont", "été", "peut", "ier", "er", "soit", "lorsque",
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
                "v", "x", "y", "z");
        List<String> number = Arrays.asList("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "I", "II", "III", "IV",
                "V");
        List<String> separator = Arrays.asList(".", "/", ",", ":", ";", "-", "_", "(", ")", "?", "%", "#");
        List<String> special_character = Arrays.asList("", "°", "\u00bf", "\u00bd");

        char_to_delete.add(number);
        char_to_delete.add(separator);
        char_to_delete.add(special_character);

        // On retire les characteres de chaque liste
        Corrector corrector = new Corrector();
        for (List<String> lst : char_to_delete) {
            text_penal = corrector.delete_char(lst, text_penal);
            text_civil = corrector.delete_char(lst, text_civil);
            //text_famille = corrector.delete_char(lst,text_famille);
            //text_travail = corrector.delete_char(lst,text_travail);
        }

        // MISE SOUS FORME DE TABLEAU
        System.out.println("MISE SOUS FORME DE TABLEAU ...");

        List<String> code_civil = string_to_List(text_civil, corrector);
        List<String> code_penal = string_to_List(text_penal, corrector);
       // List<String> code_famille = string_to_List(text_famille ,corrector);
        //List<String> code_travail = string_to_List(text_travail ,corrector);

        List<List<String>> lst_civil_penal = new ArrayList<>();
        lst_civil_penal.add(code_civil);
        lst_civil_penal.add(code_penal);
       // lst_civil_penal.add(code_famille);
       // lst_civil_penal.add(code_travail);
        // CONVERTION EN DICO ET EXPORT EN .CSV

        System.out.println("EXPORTATION ...");

        for (int i = 0; i < lst_civil_penal.size(); i++) {
            // ON RETIRE LE RESTE DES MOTS INUTILES
            lst_civil_penal.get(i).removeAll(useless);
            // EXPORT TO CSV
            if (i == 0) {
                String path = "src/wordcloud/csv_file/dico_code_civil.csv";
                export.to_csv(path, List_to_dico(lst_civil_penal.get(i)));
                System.out.println("Code civil exporté en csv : OK");

            } else if (i == 1) {
                String path = "src/wordcloud/csv_file/dico_code_penal.csv";
                export.to_csv(path, List_to_dico(lst_civil_penal.get(i)));
                System.out.println("Code penal exporté en csv : OK");

            } else if (i == 2) {
                String path = "src/wordcloud/csv_file/dico_code_famille.csv";
                export.to_csv(path, List_to_dico(lst_civil_penal.get(i)));
                System.out.println("Code famille exporté en csv : OK");

            } else if (i == 3) {
                String path = "src/wordcloud/csv_file/dico_code_travail.csv";
                export.to_csv(path, List_to_dico(lst_civil_penal.get(i)));
                System.out.println("Code famille exporté en csv : OK");
            }

        }
    }
}