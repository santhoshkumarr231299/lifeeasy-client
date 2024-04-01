import React, { useState } from "react";
import { Paper, CircularProgress, Button } from "@mui/material";
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

function SearchMedicines({ theme }) {
    const [medicines, setMedicines] = useState<medicine[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchWord, setSearchWord] = useState("");

    const fetchMedicines = () => {
        if(!searchWord || searchWord === '') {
            setMedicines(()=>[]);
            return;
        }
        setIsLoading(true);
        axios.get("/drug-info?searchWord=" + searchWord).then( (response : any) => {
            let temp : medicine[] = [];
            response.data.forEach((data : any) => {
                data.packaging.forEach((packData : any) => {
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

    return <div>
    <Paper
      elevation={3}
      style={{
        textAlign: "right",
        alignSelf: "center",
        margin: "auto",
        backgroundColor: theme.background,
        width: "1560px",
        height: "810px",
        color: theme.fontColor
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
                            color: theme.fontColor,
                            border : '1px solid ' + theme.fontColor
                        }}
                        id="outlined-adornment-amount"
                        startAdornment={
                            <InputAdornment position="start">
                            <SearchIcon sx={{ color: theme.fontColor }} />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                            {isLoading && <CircularProgress style={{ marginRight: "10px" }} size={20} />}
                            </InputAdornment>
                        }
                        placeholder="Search Medicines..."
                        onChange={(e) => setSearchWord(e.target.value)}
                        />
                </div>
                <div>
                    <Button
                        style={{
                            marginBottom: "20px",
                            marginTop: "20px",
                            right: 65,
                            backgroundColor: theme.others,
                        }}
                        variant="contained"
                        onClick={() =>fetchMedicines()}
                    >
                    Search
                    </Button>
                </div>
            </div>
            <div style={{
                margin : '50px',
            }}>
            <table style={{textAlign : 'center', border : '1px solid ' + theme.fontColor}}>
                <tr>
                    <th style={{width : '200px', border : '1px solid ' + theme.fontColor}}>Name</th><th style={{width : '200px', border : '1px solid ' + theme.fontColor}}>Manufacturer</th><th style={{width : '200px', border : '1px solid ' + theme.fontColor}}>Dosage</th><th style={{width : '200px', border : '1px solid ' + theme.fontColor}}>Route of Intake</th><th style={{width : '200px', border : '1px solid ' + theme.fontColor}}>Description</th>
                </tr>
                {medicines.map((medicine) => 
                <tr key={medicine.name}>
                    <td style={{width : '200px', border : '1px solid ' + theme.fontColor, color : theme.others, fontStyle: 'bold'}}>{medicine.name}</td><td style={{width : '200px', border : '1px solid ' + theme.fontColor}}>{medicine.manufacturer}</td><td style={{width : '200px', border : '1px solid ' + theme.fontColor}}>{medicine.dosageForm}</td><td style={{width : '200px', border : '1px solid ' + theme.fontColor}}>{medicine.routeOfIntake}</td><td style={{width : '200px', border : '1px solid ' + theme.fontColor}}>{medicine.description}</td>
                </tr>
                )}
            </table>
            </div>        
    </Paper>
    </div>
}

export default SearchMedicines;