import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart,{generateCartItemsFrom} from "./Cart"


const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<{ _id: String, name: String, category: String, image: String, rating: Number, cost: Number}> }
   *      Array of objects with complete data on all available products
   * 
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const [isProductLoading , setIsLoading] = useState(false)
  const [searchValid,setIfSearchValid] = useState("true")
  const [product, setProducts] = useState([]);
  const [timerId, setTimerId] = useState(null); 
  const [productsData,setProductsData] = useState("")
  /**for CartData */
  const [cartData,setCartData] = useState("")

  
  const performAPICall = async () => {
    let url = `${config.endpoint}/products`;
            try{
              /**Product Loading.... */
                  setIsLoading(true)
               const response = await axios.get(url);
               const data = response.data;
                  setIsLoading(false)
                // console.log("PerformAPICall",data)
          /***get the product data  with --ValidSearch*/     
                 setProducts(data); 
                setProductsData(data)
           }
       catch(error){
          console.log(error)
       }  
  };
    

  useEffect(()=>{
  performAPICall();
  fetchCart(localStorage.getItem("token"))  
  },[])
   
  
// console.log("CartDataDetails",generateCartItemsFrom(cartData,productsData))
// let inCart =  generateCartItemsFrom(cartData,productsData)
// console.log("InCart",inCart)

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */


  const performSearch = async (text) => {
     let url = `${config.endpoint}/products/search?value=${text}`;
          try{
              const response = await axios.get(url);
              const data = response.data;
            //  console.log("PerformingSearch",data)
        /***get the product data  with --ValidSearch*/  
                 setProducts(data);
                setIfSearchValid(true)
           }
      catch(error){
              setIfSearchValid(false)
           }     
  };
  

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value
    if (timerId){
       clearTimeout(timerId);
    } 
     const debounceTimeoutId = setTimeout(() => performSearch(value),debounceTimeout);
     setTimerId(debounceTimeoutId);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  //  const tocart ={
  //   "productId": "KCRwjF7lN97HnEaY",
  //      "qty": 4
  //  }



  
  const fetchCart = async (token) => {
    if (!token) return;
    let url = `${config.endpoint}/cart`;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
     const response =  await axios.get(url,{
                 headers: {
                      'Authorization': `Bearer ${token}`
                    }
                 })
        const CartData = response.data       
        // console.log("CartData",CartData) 
           setCartData(CartData)
    } catch (e) {
         if (e.response && e.response.status === 400){
              return  enqueueSnackbar( e.response.data.message, { variant: 'error'});
             }
          else{
         enqueueSnackbar( "Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: 'error'});
           }
      }
      // return null;
    }

 
    // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
       for(let i = 0 ; i < items.length;i++)
     {
         if(productId === items[i]["productId"])
         {
            enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{ variant: 'warning'}) 
                    return false
          }          
      }
      return false
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<{ productId: String, name: String, category: String, image: String, rating: Number, cost: Number}> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 404
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

 const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {


/** `Make a POST /cart request to update the cart and utilise the response data which again returns the latest cart items, to update the Frontend`
** ->Has the advantage of using lesser API bandwidth which will come in super-handy once your QKart app attracts huge number of Customers***/
       
  if(localStorage.getItem("username")){ 

          if(!isItemInCart(items, productId))
           {
                  let postDataToCart = {
                    "productId": productId,
                       "qty" :  qty
                    }
              let url = `${config.endpoint}/cart`;
              try {
                const response =  await axios.post(url,postDataToCart,{
                         headers: {
                              'Authorization': `Bearer ${token}`
                            }
                         })
                    const PostData = response.data       
                    // console.log("PostCartData",PostData)
                  // POST `/cart` request to update the cartData
                       setCartData(PostData); 
                  } 
            catch(e){
              if (e.response && e.response.status === 400)
              {
                  return  enqueueSnackbar( e.response.data.message, { variant: 'error'});
              }
                enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{ variant: 'warning'})          
              }
         }
        else{
              enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{ variant: 'warning'}) 
            }

      }
   
    else{
        enqueueSnackbar("Login to add an item to the Cart",{ variant: 'warning'})
       }
  };


    // handleAddToCart={() => {console.log("Added to cart" , product._id,product.name)}                   
    let mountGrid = <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
                   {product.map((product) => (
                   <Grid item xs={6} md={3} className="product-grid" key={product._id}>
                      <ProductCard 
                       product={product}
                       handleAddToCart={()=>addToCart(
                             localStorage.getItem("token"),
                             cartData,
                             productsData,
                             product._id,
                              1
                            )}
                          />
                   </Grid>))}
                  </Grid>

    let searchCheck = searchValid ? mountGrid
                                  :<Box className="loading">
                                  <SentimentDissatisfied  />
                                    <p>No products found</p>
                               </Box>
  
  if(!localStorage.getItem("username")){
        return ( 
          <div>
              <Header hasHiddenAuthButtons={true}>
              {/* Search view for desktop */}
              <TextField
              className="search-desktop"
              size="small"
              InputProps={{
                className:"search",
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search for items/categories"
              name="search"
              onChange={(event)=> debounceSearch(event,500)}
            />
            </Header>
                   
        {/* Search view for mobiles */}
        <TextField
                className="search-mobile"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                onChange={(event)=> debounceSearch(event,500)}
                placeholder="Search for items/categories"
                name="search"
              />
            
                 <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box>
                 
                {isProductLoading ? <Box  className="loading">
                                      <CircularProgress color="success"/>
                                      <p>Loading Products...</p> 
                                  </Box>  
                            :  searchCheck}          
      
                {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
              <Footer />
            </div>
          );
       }
         else{
          return (
            <div>
               <Header hasHiddenAuthButtons={true}>
               {/* Search view for desktop */}
               <TextField
               className="search-desktop"
               size="small"
               InputProps={{
                className:"search",
                 endAdornment: (
                   <InputAdornment position="end">
                     <Search color="primary" />
                   </InputAdornment>
                 ),
               }}
               placeholder="Search for items/categories"
               name="search"
               onChange={(event)=> debounceSearch(event,500)}
             />
             </Header>
         
         {/* Search view for mobiles */}
               <TextField
                 className="search-mobile"
                 size="small"
                 fullWidth
                 InputProps={{
                   endAdornment: (
                     <InputAdornment position="end">
                       <Search color="primary" />
                     </InputAdornment>
                   ),
                 }}
                 onChange={(event)=> debounceSearch(event,500)}
                 placeholder="Search for items/categories"
                 name="search"
               />
              <Grid container >
                 <Grid item xs={12} md={9}>
                  <Box className="hero">
                   <p className="hero-heading">
                     India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                     to your door step
                   </p>
                 </Box>
                  
                 {isProductLoading ? <Box  display="flex"  flexDirection="column" justifyContent="center" alignItems="center">
                                       <CircularProgress color="success"/>
                                       <p>Loading Products...</p> 
                                   </Box>  
                                 :  searchCheck}          
                
                </Grid >
                  <Grid item xs={12} md={3} bgcolor="#E9F5E1" >
                    <Box  display="flex" justifyContent="start">
                       <Cart items ={generateCartItemsFrom(cartData,productsData)}
                             handleQuantity={setCartData}
                         />   
                    </Box>
                  </Grid>
               </Grid>
       
                 {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
               <Footer />
             </div>
           );
         }  
  };

  
export default Products;
