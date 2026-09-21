import { createSlice } from "@reduxjs/toolkit";

// Get saved addresses from localStorage
const savedAddresses = JSON.parse(
    localStorage.getItem("addresses") || "[]"
);

// Get selected address from localStorage
const savedSelectedAddress = JSON.parse(
    localStorage.getItem("selectedAddress") || "null"
);

const productSlice = createSlice({

    name: "product",

    initialState: {
        products: [],
        cart: [],
        addresses: savedAddresses,
        selectedAddress: savedSelectedAddress
    },

    reducers: {

        // =========================
        // Products
        // =========================

        setProducts: (state, action) => {
            state.products = action.payload;
        },


        // =========================
        // Cart
        // =========================

        setCart: (state, action) => {
            state.cart = action.payload;
        },


        // =========================
        // Add Address
        // =========================

        addAddress: (state, action) => {

            state.addresses.push(action.payload);

            localStorage.setItem(
                "addresses",
                JSON.stringify(state.addresses)
            );
        },


        // =========================
        // Select Address
        // =========================

        setSelectedAddress: (state, action) => {

            state.selectedAddress = action.payload;

            localStorage.setItem(
                "selectedAddress",
                JSON.stringify(state.selectedAddress)
            );
        },


        // =========================
        // Delete Address
        // =========================

        deleteAddress: (state, action) => {

            const deletedIndex = action.payload;

            // Remove address
            state.addresses = state.addresses.filter(
                (_, index) => index !== deletedIndex
            );


            // If deleted address was selected
            if (state.selectedAddress === deletedIndex) {

                state.selectedAddress = null;

                localStorage.removeItem("selectedAddress");
            }


            // If selected address was after
            // the deleted address, adjust index
            else if (
                state.selectedAddress !== null &&
                state.selectedAddress > deletedIndex
            ) {

                state.selectedAddress -= 1;

                localStorage.setItem(
                    "selectedAddress",
                    JSON.stringify(state.selectedAddress)
                );
            }


            // Save updated addresses
            localStorage.setItem(
                "addresses",
                JSON.stringify(state.addresses)
            );
        }

    }
});


export const {
    setProducts,
    setCart,
    addAddress,
    setSelectedAddress,
    deleteAddress
} = productSlice.actions;


export default productSlice.reducer;