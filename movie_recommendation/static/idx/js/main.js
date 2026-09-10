console.log("Hello world")

const BASE_URL = 'https://movie-recommendation-202.herokuapp.com/'

const loadMovies = async (input,n=5) => {
    
    console.log("loading movies ..",input," ...")
    const response = await fetch(`${BASE_URL}movies/search?startwith=${input}&n=${n}`)
    
    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let json = await response.json();
        console.log('successfully loaded the movies .. ')
        
        let dl = document.getElementById("wizards-list");
        let suggestions = json.li
        console.log('modifying ..',suggestions)
        // clear all the datalist
        dl.innerHTML = ''

        for (let s of suggestions){
          dl.innerHTML += '<option>'+s+'</option>'
        }
        
        console.log(JSON.stringify(json,null,2))
      } else {
        alert("HTTP-Error: " + response.status);
      }
    
}

const loadRecommendedMovie = async (input, n=10) =>{
  console.log("loading recommeded movies ..",input," ...")
    const response = await fetch(`${BASE_URL}movies/recommend?n=${n}&name=${input}`)
    
    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let json = await response.json();
        console.log('successfully recommended loaded the movies .. ')

        let selected_movie = document.getElementById("selected-movie-image");
        
        selected_movie.innerHTML = `<img id="selected-movie-image"
        style="object-fit: contain;  "
        height="350"
        width="350"
        src=${json.recommended[0][1]} alt="" />`
        
         
        
        console.log('selected movie',selected_movie,'\n')
        document.getElementById('selected-movie-title').innerHTML = input 
        
        let dl = document.getElementById("recommended-movies-list");
        let recommended = json.recommended
        console.log('modifying ..',recommended)
        // clear all the datalist
        dl.innerHTML = ''
        let count = 0
        recommended.shift()
        for (let s of recommended){
          count++;
          if(count<5){
            dl.innerHTML += `
            <div style="padding-left:10px; width:200px; "> 
            <center><img 
            style="object-fit: fill; " 
            height="200" 
            src=${s[1]}  
            alt="" srcset=""> 
            </center>
            <center>
            <div style=" margin-left:10px; word-wrap: break-word; font-size: 14px" >${s[0]}</div> 
            </center></div>`   
          
          }else{
            break;
          }
          
        }
        
        // console.log(JSON.stringify(json,null,2))
      } else {
        alert("HTTP-Error: " + response.status);
      }
}

const showSelectedMovie = () => {
    // let selectedMovie = document.getElementById("selectedMovie")
    let input = document.getElementById("fname");
    // selectedMovie.innerHTML = input.value
    loadMovies(input.value)
    loadRecommendedMovie(input.value,5)
}


const onSearch = () =>{
    let input = document.getElementById("fname");
    loadMovies(input.value)
}



