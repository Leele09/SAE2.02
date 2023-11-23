import java.util.List;

public class Corrector {
    String text;

    public Corrector(){
    }

    public String delete_char(List<String> lst_word , String text ){
        // On remplace les apostrophes par des e pour créer un déterminants
        text = text.replace("'", "e ");
        text = text.replace('"', ' ');

        // On remplace les chiffres par des espaces
        for (String word : lst_word) {
            text = text.replace(word.charAt(0), ' ');
            // On remplace la ponctuation par des espaces
        }
        return text;
    }

    public List<String> upper_to_lower(List<String> converted_liste , int i){

        String first_letter = converted_liste.get(i).substring(0, 1);
        String rest_of_letter = converted_liste.get(i).substring(1);
        converted_liste.set(i, first_letter.toLowerCase() + rest_of_letter);

        return converted_liste;

    }

    
}
