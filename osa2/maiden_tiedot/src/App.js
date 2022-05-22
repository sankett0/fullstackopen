import { useState, useEffect } from 'react'
import axios from 'axios'


const CountryInfo = props => {
  return (
    <>
      <h2>{props.country.name.common}</h2>
      <p>capital {props.country.capital[0]}</p>
      <p>area {props.country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(props.country.languages).map((key, idx) => <li key={idx}>{props.country.languages[key]}</li>)}
      </ul>
      <img src={props.country.flags.png}/>
    </>
  )
}

const Countries = props => {

  const countriesAmount = props.countries.length
  if (countriesAmount > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countriesAmount > 1 && countriesAmount <= 10) {
    return props.countries.map((country, idx) => (
      <p key={idx}>
        {country.name.common}
        <button onClick={() => props.handleShowButton(country.name.common)}>show</button>
      </p>
    ))
  } else if (countriesAmount === 1) {
    return <CountryInfo country={props.countries[0]}/>
  } else {
    return <></>
  }
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(res => {
        setCountries(res.data)
      })
  }, [])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter))
 
  const handleShowButton = countryName => {
    setFilter(countryName)
    console.log(countryName)
    countries.filter(country => country.name.common.toLowerCase().includes(filter))
  }

  return (
    <div>
      find countries <input onChange={e => setFilter(e.target.value)} value={filter}/>  
      <Countries countries={filteredCountries} handleShowButton={handleShowButton}/>
    </div>
  )

}

export default App