
// Função para transformar a primeira letra em maiúscula
export function capitalizeFirstLetter(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1);
}


/*
* Import the function and use it on a computed property.
* Author: MrRudRud a https://codepen.io/mrrudrud/pen/QVyZze
* 
*     varName = computed(() => {
*       return useSanitizeWords(otherVar)
*     })
*/
export function useSanitizeWords(word) {
      var slug = "";
      // Change to lower case
      var wordLower = String(word).toLowerCase();
      // Letter "e"
      slug = wordLower.replace(/e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ/gi, 'e');
      // Letter "a"
      slug = slug.replace(/a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ/gi, 'a');
      // Letter "o"
      slug = slug.replace(/o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ/gi, 'o');
      // Letter "u"
      slug = slug.replace(/u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự/gi, 'u');
      // Letter "c"
      slug = slug.replace(/ç/gi, 'c');
      // Letter "d"
      slug = slug.replace(/đ/gi, 'd');
      // Trim the last whitespace
      slug = slug.replace(/\s*$/g, '');
      // Change whitespace to "-"
      slug = slug.replace(/\s+/g, '-');
      
      return slug;
    }