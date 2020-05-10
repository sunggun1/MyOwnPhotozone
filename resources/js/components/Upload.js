import React, { Component } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import {ResponsiveEmbed, Image} from 'react-bootstrap';

import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
Geocode.setApiKey("AIzaSyAf-aClEvdGqO749dVaU8caSb-9l1bTggk" );
Geocode.enableDebug();

function getArea( addressArray ){
	let area = '';
	if(addressArray){
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	}
};

function getCity ( addressArray ){
	let city = '';
	if(addressArray){
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	}
};

function getState( addressArray ){
	let state = '';
	if(addressArray){
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	}
};

class Map extends Component{
    constructor( props ){
		super( props );
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
			},
			markerPosition: {
				lat: this.props.center.lat,
				lng: this.props.center.lng
            }
		}
    }
    componentDidMount() {
		Geocode.fromLatLng( this.state.mapPosition.lat , this.state.mapPosition.lng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = getCity( addressArray ),
				      area = getArea( addressArray ),
				      state = getState( addressArray );

				console.log( 'city', city, area, state );

				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
				} )
			},
			error => {
				console.error( error );
			}
		);
    };

    shouldComponentUpdate( nextProps, nextState ){
		if (
			this.state.markerPosition.lat !== this.props.center.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state
		) {
			return true
		} else if ( this.props.center.lat === nextProps.center.lat ){
			return false
		}
    }

    onChange = ( event ) => {
		this.setState({ [event.target.name]: event.target.value });
    };
    onInfoWindowClose = ( event ) => {

    };
    onMarkerDragEnd = ( event ) => {
		let newLat = event.latLng.lat(),
		    newLng = event.latLng.lng();

		Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address,
				      addressArray =  response.results[0].address_components,
				      city = this.getCity( addressArray ),
				      area = this.getArea( addressArray ),
				      state = this.getState( addressArray );
				this.setState( {
					address: ( address ) ? address : '',
					area: ( area ) ? area : '',
					city: ( city ) ? city : '',
					state: ( state ) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
                } )
                this.props.onChangeLocation({newLat,newLng});
			},
			error => {
				console.error(error);
			}
		);
    };
    
    onPlaceSelected = ( place ) => {
		console.log( 'plc', place );
		if(place.formatted_address){
			const address = place.formatted_address,
				addressArray =  place.address_components,
				city = getCity( addressArray ),
				area = getArea( addressArray ),
				state = getState( addressArray ),
				latValue = place.geometry.location.lat(),
				lngValue = place.geometry.location.lng();
			// Set these values in the state.
			this.setState({
				address: ( address ) ? address : '',
				area: ( area ) ? area : '',
				city: ( city ) ? city : '',
				state: ( state ) ? state : '',
				markerPosition: {
					lat: latValue,
					lng: lngValue
				},
				mapPosition: {
					lat: latValue,
					lng: lngValue
				},
			})
			this.props.onChangeLocation({latValue,lngValue});
		}
	};

    render(){
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap 
					           defaultZoom={ this.props.zoom }
					           defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
					>
						{/* InfoWindow on top of marker */}
						<InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: ( this.state.markerPosition.lat + 0.0018 ), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{ this.state.address }</span>
							</div>
						</InfoWindow>
						{/*Marker*/}
						<Marker 
						        name={'Dolores park'}
						        draggable={true}
						        onDragEnd={ this.onMarkerDragEnd }
						        position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
								marginBottom: '50px'
							}}
							onPlaceSelected={ this.onPlaceSelected }
							types={['(regions)']}
						/>
					</GoogleMap>
				)
			)
		);
		let map;
		if( this.props.center.lat !== undefined ) {
			map = <div>
				<div>
					<div className="form-group">
						<label htmlFor="">City</label>
						<input type="text" name="city" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.city }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Area</label>
						<input type="text" name="area" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.area }/>
					</div>
					<div className="form-group">
						<label htmlFor="">State</label>
						<input type="text" name="state" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.state }/>
					</div>
					<div className="form-group">
						<label htmlFor="">Address</label>
						<input type="text" name="address" className="form-control" onChange={ this.onChange } readOnly="readOnly" value={ this.state.address }/>
					</div>
				</div>

				<AsyncMap
					googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAf-aClEvdGqO749dVaU8caSb-9l1bTggk&libraries=places"
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: this.props.height }} />
					}
					mapElement={
						<div style={{ height: `100%` }} />
					}
				/>
			</div>
		} else {
			map = <div style={{height: this.props.height}} />
		}
		return( map )
	}    
}


export default class Upload extends Component{
    constructor(props){
        super(props);
        this.state = {
			name: '',
            mapX: '',
			mapY: '',
			placeUploadSuccess: false,
			image: '',
			imagePreviewURL: '',
			place_no: ''
        };
        this.changeMapXY = this.changeMapXY.bind(this);
        this.changeX = this.changeX.bind(this);
        this.changeY = this.changeY.bind(this);
		this.changeName = this.changeName.bind(this);
		this.onChange = this.onChange.bind(this);
		this.fileUpload = this.fileUpload.bind(this);
		this.placeUpload = this.placeUpload.bind(this);
	}
	onChange(event){
		console.log('OnChange Method');
		event.preventDefault();
		let files = event.target.files || event.dataTransfer.files;
		if(!files.length)
			return;
		let file = files[0];
		
		console.log(file);
		let reader = new FileReader();
		reader.onloadend = (e) => {
			this.setState({
				image: file,
				imagePreviewURL: e.target.result
			});
		}
		reader.readAsDataURL(file);
	}

	placeUpload(event){
		console.log('placeUploadStart');
		const formData = {
			place_name : this.state.name,
            mapX:  this.state.mapX,
			mapY:  this.state.mapY,
			use_yn : 'Y'
		}
		axios.post('http://127.0.0.1:80/api/place/store', formData)
				.then(response => {
					console.log(response)
					this.setState({
						place_no : response.data.last_insert_id,
						placeUploadSuccess:response.data.success
					});
					console.log(this.state.place_no,this.state.placeUploadSuccess);
					this.fileUpload.bind(this)(event);
				})
				.catch(error=>{
					console.log(error)
				});
	}

	fileUpload(event){
		console.log('fileUploadStart');
		console.log(this.state);
		const img_url = `public/img/${this.state.place_no}`;
		console.log(img_url);

		// let formData = new FormData();
		// formData.append('file',this.state.imagePreviewURL);
		// formData.append('place_no',this.state.place_no);
		// formData.append('img_url',img_url);
		// formData.append('use_yn','Y');
		// formData.append('report_no',0);
		
		// const formData = {
		// 	file: this.state.imagePreviewURL,
		// 	place_no : this.state.place_no,
        //     img_url:  img_url,
		// 	use_yn: 'Y',
		// 	report_no : 0
		// }

		const formData = new FormData();
		formData.set('place_no',this.state.place_no);
		formData.set('img_url',img_url);
		formData.set('use_yn','Y');
		formData.set('report_no',0);
		formData.append('file',this.state.image);

		{this.state.placeUploadSuccess && 
		axios.post('http://127.0.0.1:80/api/place_img/store',formData)
			.then(res => {
				console.log(res)
			})
			.catch(error=>{
				console.log(error)
			});
		}
	}

	onFormSubmit(event){
		event.preventDefault();
		this.placeUpload.bind(this)(event);
	}

    changeName( event ){
        this.setState({name : event.target.value});
    }
    changeMapXY( location ){
        this.setState({ mapX : location.latValue , mapY: location.lngValue});    
    }
    changeX(event){
        this.setState({mapX : event.target.value});
    }
    changeY(event){
        this.setState({mapY : event.target.value});
    }
    render(){
		let profile_preview = null;
		if(this.state.imagePreviewURL !== ''){
			console.log(this.state);
			profile_preview = <img className="profile_preview" 
			src={this.state.imagePreviewURL}
			style={{  
				width: 900,
				height: 300,
				border: '1px solid #ddd'
			}}
			></img>
		}

        return (
            <div style={{ margin: '100px' }}>
                <Map
                    center={{lat: 18.5204, lng: 73.8567}}
                    height='300px'
                    zoom={15}
                    onChangeLocation={this.changeMapXY}
                />
                <br/>
                <br/>
                <br/>
                <Form encType="multipart/form-data">
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column lg={2}>
                                Place Name
                            </Form.Label>
                            <Col>
                                <Form.Control type="text" name="place_name" placeholder="Place Name" onChange={this.changeName} value={this.state.name}/>
                            </Col>
						</Form.Row>
					</Form.Group>
					<Form.Group>
						<Form.Row>
							<Form.Label column lg={1}>
                                MapX
                            </Form.Label>
                            <Col>
                                <Form.Control type="text" name="mapX" placeholder="MapX" value={this.state.mapX} onChange={this.changeX}/>
                            </Col>
						</Form.Row>
					</Form.Group>
					<Form.Group>
						<Form.Row>
							<Form.Label column lg={1}>
								MapY
							</Form.Label>
							<Col>
								<Form.Control type="text" name="mapY" placeholder="MapY" value={this.state.mapY} onChange={this.changeY}/>
							</Col>
						</Form.Row>
					</Form.Group>
					<Form.Group>
						<Form.Row>
							<Form.Label column lg={1}>
								FileInput
							</Form.Label>
							<Col>
								<Form.File
									id="custon-file"
									label="Custom File input"
									onChange={this.onChange}
									accept='image/jpg,image/png,image/jpeg,image/gif'
									custom
									name="file"
									type="file"
									encType="multipart/form-data"
								/>
							</Col>
                        </Form.Row>
                    </Form.Group>
					{profile_preview}
					<br/>
                    <Button type="button" onClick={this.onFormSubmit.bind(this)} variant="primary">
                        Submit
                    </Button>
                </Form>
				
            </div>
        );
    }
}