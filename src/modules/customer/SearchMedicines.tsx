import React, { useEffect, useState } from "react";
import { TextField, Button, Paper, CircularProgress } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../api/axios";


interface medicine {
    name : string,
    manufacturer : string,
    dosageForm : string,
    routeOfIntake : string,
    description : string,
}

function SearchMedicines() {
    const [medicines, setMedicines] = useState<medicine[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchMedicines = (e : any) : void => {
        e.preventDefault();
        if(!e.target.value || e.target.value == '') {
            setMedicines(()=>[]);
            return;
        }
        setIsLoading(true);
        const options = {
            method: 'GET',
            url: 'https://drug-info-and-price-history.p.rapidapi.com/1/druginfo',
            params: {drug: e.target.value},
            headers: {
              'X-RapidAPI-Key': 'a01f99be40mshda5728a99cf7da8p1b9fa3jsndee8ef30ebd2',
              'X-RapidAPI-Host': 'drug-info-and-price-history.p.rapidapi.com'
            }
          };
        axios.request(options).then(function (response) {
            let temp : medicine[] = [];
            response.data.forEach((data) => {
                data.packaging.forEach((packData) => {
                    temp.push({
                        name : data.brand_name,
                        manufacturer : data.labeler_name,
                        dosageForm : data.dosage_form,
                        routeOfIntake : data.route[0],
                        description : packData.description,
                    });
                })
            })
            setMedicines(() => temp);
            setIsLoading(false);
        }).catch(function (error) {
            // console.error(error);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        const optins = {
            method: 'GET',
            url: 'https://iterar-mapi-us.p.rapidapi.com/api/reserpine/substances.json',
            headers: {
              'X-RapidAPI-Key': 'a01f99be40mshda5728a99cf7da8p1b9fa3jsndee8ef30ebd2',
              'X-RapidAPI-Host': 'iterar-mapi-us.p.rapidapi.com'
            }
          };
          
          axios.request(optins).then(function (response) {
              console.log(response.data);
          }).catch(function (error) {
              console.error(error);
          });
    })

    return <div>
        <Paper
      elevation={3}
      style={{
        textAlign: "right",
        alignSelf: "center",
        margin: "auto",
        backgroundColor: "white",
        width: "1135px",
        height: "600px",
        color: "Black",
      }}
    >
        <div style={{
            display : 'flex',
            gap: '100px',
            alignItems: 'center',
        }}>
                <div>
                    <OutlinedInput
                        style={{
                            width: "80%",
                            margin: "25px 0px 20px 0px",
                            zIndex: "0",
                        }}
                        id="outlined-adornment-amount"
                        startAdornment={
                            <InputAdornment position="start">
                            <SearchIcon />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                            {isLoading && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                            </InputAdornment>
                        }
                        placeholder="Search Medicines..."
                        onChange={(e) => fetchMedicines(e)}
                        />
                </div>
                {/* <div>
                    <Button
                        style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                        right: 65,
                        backgroundColor: "purple",
                        }}
                        variant="contained"
                        onClick={() => fetchMedicines()}
                    >
                    Search
                    </Button>
                </div> */}
            </div>
            <div style={{
                margin : '50px',
            }}>
            <table style={{textAlign : 'center', border : '1px solid black'}}>
                <tr>
                    <th style={{width : '200px', border : '1px solid black'}}>Name</th><th style={{width : '200px', border : '1px solid black'}}>Manufacturer</th><th style={{width : '200px', border : '1px solid black'}}>Dosage</th><th style={{width : '200px', border : '1px solid black'}}>Route of Intake</th><th style={{width : '200px', border : '1px solid black'}}>Description</th>
                </tr>
                {medicines.map((medicine) => 
                <tr>
                    <td style={{width : '200px', border : '1px solid black', color : 'purple', fontStyle: 'bold'}}>{medicine.name}</td><td style={{width : '200px', border : '1px solid black'}}>{medicine.manufacturer}</td><td style={{width : '200px', border : '1px solid black'}}>{medicine.dosageForm}</td><td style={{width : '200px', border : '1px solid black'}}>{medicine.routeOfIntake}</td><td style={{width : '200px', border : '1px solid black'}}>{medicine.description}</td>
                </tr>
                )}
            </table>
            </div>        
    </Paper>
    </div>
}

export default SearchMedicines;