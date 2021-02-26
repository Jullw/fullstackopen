import React, {useState, useEffect} from 'react'
import axios from 'axios'


const Filter = ({searchName, handleSearch}) =>{
  return(
    <div>
    search for countries: <input value={searchName} onChange={handleSearch}></input>
    </div>
  )
}

const Countries =({countriesToShow, handleClick}) =>{
  if(countriesToShow.length > 10){
    return(
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
      )
  }else if(countriesToShow.length === 1){
    return(
      <div>
        {countriesToShow.map((country) =>
          <OneCountry key={country.name} country={country}/>
          )}
      </div>
      )
  }else{
    return(
      <div>
        {countriesToShow.map((country) => 
          <ManyCountries key={country.name} country={country} handleClick={handleClick} />
        )}
      </div>
    )
  }
}

const ManyCountries = ({country, handleClick}) =>{
  return(
    <>
    <p>{country.name}  <Button handleClick={()=> handleClick(country.name)} country={country}/> </p>
    </>
  )
}

const Button = ({handleClick}) => <button onClick={handleClick}> show </button>


const OneCountry =({country}) =>{

  const [ weatherData, setWeatherData ]= useState([])

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
    .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.name}`)
    .then(response => {
      setWeatherData(response.data.current)
    })
  },[])


  return(
    <>
    <h1>{country.name}</h1>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h2>languages</h2>
    {country.languages.map((country) => 
          <li key={country.name}> {country.name}</li> 
        )}
    <img height="20%" width="20%" src={country.flag} alt="flag" />
    <h2>Weather in {country.name}</h2>
    <p><b>Temperature:</b> {weatherData.temperature} celcius</p>
    <img height="10%" width="10%" src={weatherData.weather_icons} alt="WeatherPic" />
    <p><b>Wind:</b> {weatherData.wind_speed} mph direction {weatherData.wind_dir}</p>
    </>
    
  )
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ searchName, setSearchName] = useState('')


  useEffect(() => {
    axios
    .get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      setCountries(response.data)
      console.log(response.data)
    })
  },[])



  const handleSearch = (event) =>{
    setSearchName(event.target.value)

  }

  const returnCountries = () =>{
    return countries.filter(country => country.name.toLowerCase().includes(searchName.toLocaleLowerCase()))
  }

  const handleClick = (countryName) =>{
    setSearchName(countryName.toLowerCase())

  }

  const countriesToShow = searchName === "" 
  ? []
  : returnCountries()

  


  return (
    <div>
      <Filter searchName={searchName} handleSearch={handleSearch} />
      <Countries countriesToShow={countriesToShow} handleClick={handleClick}/>
    </div>
  )
}

export default App;
