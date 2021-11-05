
import React from 'react';
// import logo from './logo.svg';

import './App.css';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps"
import Geocode from "react-geocode";
import { Descriptions } from 'antd';
import AutoComplete from 'react-google-autocomplete';
Geocode.setApiKey("process.env.REACT_APP_API_KEY")

class App extends  React.Component {

  state={

    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition:{
      lat: 0,
      lng: 0,
    },
    markerPosition:{
      lat: 0,
      lng: 0,
    }
 }

componentDidMount() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position =>{

      this.setState({

        mapPosition:{
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        markerPosition:{
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }


      }, ()=>{

        Geocode.fromLatLng(position.coords.latitude,position.coords.longitude)
        .then(response=>{
    
          const address=response.results[0].formatted_address,
          addressArrray=response.results[0].address_components,
          city=this.getCity(addressArrray),
          area=this.getArea(addressArrray),
          state=this.getState(addressArrray);
    
          this.setState({
                 address : (address) ? address : "",
                 area : (area) ? area : "",
                 city : (city) ? city : "",
                 state : (state) ? state : "",
                
    
    
          })
    
    
        })




      })

    })
  }

}

  
  getCity=(addressArray)=>{
    
    
    let city='';
     for(let index=0 ;index < addressArray.length;index++){
       if(addressArray[index].types[0]  && 'administrative_area_level_2'=== addressArray[index].types[0]){
        city=addressArray[index].long_name;
        return city;

       }
     }
   }

   getArea=(addressArray)=>{
    
    let area='';
     for(let index=0 ;index < addressArray.length;index++){
       if(addressArray[index].types[0]){

        for(let j=0; j < addressArray.length;j++){
          if('sublocality_level_1'===addressArray[index].types[j] || 'locality'===addressArray[index].types[j])
          area=addressArray[index].long_name;
          return area;
        }
       }
     }
   }

   

   getState=(addressArray)=>{
    
     let state='';
     for(let index=0 ;index < addressArray.length;index++){
      for(let index=0 ;index < addressArray.length;index++){

        if(addressArray[index].types[0]  && 'administrative_area_level_1'===addressArray[index].types[0]){

          state=addressArray[index].long_name;
          return state;
        }
      }

     }


   }


  onMarkerDragEnd=(event)=>{

    let newlat= event.latLng.lat();
    let newLng=event.latLng.lng();
    console.log(newlat,newLng)
    Geocode.fromLatLng(newlat,newLng)
    .then(response=>{

      const address=response.results[0].formatted_address,
      addressArrray=response.results[0].address_components,
      city=this.getCity(addressArrray),
      area=this.getArea(addressArrray),
      state=this.getState(addressArrray);

      this.setState({
             address : (address) ? address : "",
             area : (area) ? area : "",
             city : (city) ? city : "",
             state : (state) ? state : "",
             markerPosition :{
               lat : newlat,
               lng  :newLng
             },
             mapPosition :{
              lat :newlat,
              lng : newLng
            },


      })


    })
  }

  onPlaceSelected =(place)=>{
 
    
    const address= place.formatted_address,
    addressArray = place.address_components,
    city = this.getCity(addressArray),
    area=this.getArea(addressArray),
    state= this.getState(addressArray),
    newlat= place.geometry.location.lat(),
    newLng= place.geometry.location.lng()

    this.setState({
      address : (address) ? address : "",
      area : (area) ? area : "",
      city : (city) ? city : "",
      state : (state) ? state : "",
      markerPosition :{
        lat : newlat,
        lng  :newLng
      },
      mapPosition :{
       lat :newlat,
       lng : newLng
     },


})

  }

render(){



  const MapWithAMarker = withScriptjs(withGoogleMap(props =>
    <GoogleMap
      defaultZoom={8}
      defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
    >
      <Marker
        draggable={true}
        onDragEnd={this.onMarkerDragEnd}
        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
        >
          <InfoWindow>
            <div>
              <h5>{this.state.address}</h5>

            </div>
          </InfoWindow>
          
        </Marker>

        <AutoComplete
        
        style={{width:"100% ",height:"40px", paddingLeft:16 ,marginTop:2,marginBottom:"2rem"}}
        types={['(regions)']}
        onPlaceSelected= {this.onPlaceSelected}
        
        />
      
    </GoogleMap>
  ));

  return(

   <>
    
    <div style={{padding:'1rem',  margin:'0 auto' ,maxwidth: 1000}}>
      <h1>Google Map Basic</h1>
    <Descriptions  bordered>
    <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
    <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
    <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
    <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
    
  </Descriptions>

    </div>
    
    <MapWithAMarker
    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAzoWCEe70nH_z2NnBAZ_SubR0dbPq2zRI&v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `400px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />

  </>

  );


}


  
}

export default App;
