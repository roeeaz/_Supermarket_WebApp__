import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getAllAsync,addAsync,selectProducts,delAsync } from './crudSlice'

const CRUD = () => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectProducts);
    const [desc, setdesc] = useState("")
    const [price, setprice] = useState(0)
    useEffect(() => {
        dispatch(getAllAsync())
    }, [])
    
    return (
        <div>
           <h1> CRUD</h1>
            Desc<input onChange={(e)=>setdesc(e.target.value)}/>
            price<input onChange={(e)=>setprice(+e.target.value)}/>
            <button onClick={() => dispatch(addAsync({desc,price}))}>add data</button> 
            <button onClick={() => dispatch(getAllAsync())}>Load data</button> 

            {products.length}
            
            <hr/>
             {products.map((prod,ind) =>  <div key={ind}>{prod.desc} : {prod.price}

            <button onClick={() => dispatch(delAsync(prod.id || 0))}>Del </button>
              </div> )}

        </div>
    )
}

export default CRUD
