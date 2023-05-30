import { useRouter } from "next/router";
import React, { useState, useEffect, FC } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";

const Shop = () => {
  return (
    <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
      <section>
        <p className="second-title">SHOP</p>
        <p>定期便</p>
        <p>※写真はイメージです</p>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          <img
            src="../s3/w_A.jpg"
            className="w-full h-36 lg:h-72 object-cover rounded-md cursor-pointer"
          />
          <img
            src="../s3/w_A.jpg"
            className="w-full h-36 lg:h-72 object-cover rounded-md cursor-pointer"
          />
          <img
            src="../s3/w_B.jpg"
            className="w-full h-36 lg:h-72 object-cover rounded-md cursor-pointer"
          />
          <img
            src="../s3/w_B.jpg"
            className="w-full h-36 lg:h-72 object-cover rounded-md cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

export default Shop;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await axios.get(`http://server:8080/sidedishes`);
    console.log("res", res);
    return {
      props: {
        sidedishinfo: res.data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        sidedishinfo: null,
      },
    };
  }
};
