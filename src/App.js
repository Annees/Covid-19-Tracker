import React, { useEffect, useState } from "react";
import { 
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {

  const[countries, setCountries] = useState([]);      //STATE = How to write a variable in REACT 
  const[country, setCountry] = useState("worldwide");     //initializing with worldwide since we want it to be the default value to be displayed  //variable for keeping track of what we actually selected
  const[countryInfo, setCountryInfo] = useState({});    //state for countryInfo initializing with empty object
  const[tableData, setTableData] = useState([]);    //variable for table data
  const[mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const[mapZoom, setMapZoom] = useState(3);
  const[mapCountries, setMapCountries] = useState([]);
  const[casesType, setCasesType] = useState("cases");
  
  useEffect(() => {     //useeffect for worldwide  we need it when the component loaded initially
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  },[]); //since no dependency it will load when app.js load

  //USEEFFECT = runs a piece of code based on a given condition 
  //if we leave the condition blank that means when the component loads and not again after
  //if we add a dependency in it then it will run first when the component loads as well as when the dependency changes
  useEffect(() => {
    //async -> send a request to the server and then do something with info
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")  //this is api end point we want to fetch //https://disease.sh/v3/covid-19/countries
      .then((response) => response.json())    //then so now when it comes back with the response, we want to first get the entire response and just takes the json fomat from it. 
      .then((data) => {   //then with that data we dont want the whole data we want to restructure
        const countries =data.map((country) => ({     //we are going to every country and we are gonna return only specific attributes
            name: country.country,    //United State, United Kingdom    //returning the object which has name key and 
            value: country.countryInfo.iso2   //USA, UK ,FR
          }));

          setCountries(countries);

          const sortedData = sortData(data);
          setTableData(sortedData);

          setMapCountries(data);
          
      });
    };
    getCountriesData();   //calling this function that we declared above
  }, []);



  //Onchange event listener for dropdown that is called every time we change in the dropdown
  //it will be an async function since it will make the call lateron 
  const onCountryChange = async (event) => {    //takes an event since onchange usually passes an event along with it
    const countryCode = event.target.value;     //basically everytime when we click that dropdown and click something inside of it then we want to get that country code that we clicked on 
    //so in order to do that we can pull it out by doing this. this event.target.value will go and grab the selected value 
    // console.log("here it is", countryCode); //for testing the fetch value
    setCountry(countryCode);    //it will change the state of country variable that is by default worldwide to clicked country and it will stick to it.
    
    //(using ternary operator condition)if the countrycode is equal to worldwide then url should be all one otherwise below url 
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)    //go to the url and fetch
    .then(response => response.json())    //once we get the response then turning it into json 
    .then(data => {
      setCountry(countryCode);    //this will update the input field and 
      setCountryInfo(data);   //this will store the response(all the data) of country information into the variable //setting the countryInfo to the data that we return

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  };
  // console.log("Country info", countryInfo);



  return (
    <div className="App">
      <div className="app__left">
          <div className="app__header">   {/* Header */}
            <h1>COVID-19 TRACKER</h1>     {/* Title + Select input dropdown field */}
            <FormControl className="app__dropdown">
              <Select variant="outlined" value={country} onChange={onCountryChange}>  {/*adding an onchange event listener to the dropdown//mapping the dropdown with the state variable country(we have given the value here of the selected option tracking variable)  */}
                <MenuItem value="worldwide">Worldwide</MenuItem>  
                {/* looping through all the countries and show dropdown list of those countries */}
                {
                  countries.map(country =>(
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </div>
          
          <div className="app__stats">
            <InfoBox 
              isRed
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={numeral(countryInfo.cases).format("0.0a")}
            />     {/* InfoBoxes passing the props to the component*/}
            <InfoBox 
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered Cases" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={numeral(countryInfo.recovered).format("0.0a")}
            />            {/* InfoBoxes */}
            <InfoBox 
              isRed
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Deaths Cases" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={numeral(countryInfo.deaths).format("0.0a")}
            />                   {/* InfoBoxes */}
          </div>
          
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
          
      </div>

      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases By Country</h3>
            <Table countries={tableData} />       {/* Table */}
            <h3 className="app__graphTitle">Worldwide New {casesType} </h3>
            <LineGraph className="app__graph" casesType={casesType}/>      {/* Graph */}
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}

export default App;










