"use client";
import React, { forwardRef } from "react";
import { FaFacebookF, FaGlobe } from "react-icons/fa";

const ReqFulfilledCertificate = forwardRef(
  (
    {
      name,
      bloodGroup,
      profileImage,
      donationDate,
      nextDonationDate,
      policeStation,
      district,
      requestId,
    },
    ref
  ) => {
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    return (
      <div
        ref={ref}
        style={{
          width: "1440px",
          height: "1800px",
          backgroundImage: 'url("/image/fullfildFacebookPost.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "515px",
            left: "970px",
            right: "295px",
            textAlign: "center",
            color: "white",
            fontSize: "40px",
            fontWeight: "800",
          }}
        >
          {bloodGroup}
        </div>

        <div
          style={{
            width: "320px",
            height: "320px",
            borderRadius: "100%",
            overflow: "hidden",
            position: "absolute",
            top: "670px",
            left: "553px",
          }}
        >
          <img
            src={
              profileImage
                ? `${imageUrl}/${profileImage}`
                : "/image/user-male.png"
            }
            alt="profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "1160px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "45px",
            fontWeight: "800",
          }}
        >
          {name}
        </div>

        <div
          style={{
            position: "absolute",
            top: "1320px",
            width: "100%",
            textAlign: "center",
            color: "#8a0303",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          {requestId}
        </div>

        <div
          style={{
            position: "absolute",
            top: "1460px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "35px",
            fontWeight: "bold",
          }}
        >
          Blood Donation Date: {donationDate}
        </div>

        <div
          style={{
            position: "absolute",
            top: "1510px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "35px",
            fontWeight: "bold",
          }}
        >
          Next Donation Date: {nextDonationDate}(After)
        </div>

        <div
          style={{
            position: "absolute",
            top: "1560px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "30px",
          }}
        >
          <span
            style={{
              backgroundColor: "white",
              color: "#8a0303",
              padding: "0.2rem 0.5rem",
            }}
          >
            Address
          </span>{" "}
          Police Station:
          <span style={{ fontWeight: "bold" }}> {policeStation}</span>,
          District:
          <span style={{ fontWeight: "bold" }}> {district}</span>
        </div>

        <div
          style={{
            position: "absolute",
            top: "1742px",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 2.5rem",
            color: "white",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "0.5rem", fontSize: "25px" }}>
            <FaGlobe
              style={{
                marginRight: "0.5rem",
                fontSize: "35px",
                display: "inline-block",
              }}
            />{" "}
            www.bloodcellbd.org
          </span>

          <span style={{ marginRight: "0.5rem", fontSize: "25px" }}>
            <FaFacebookF
              style={{
                marginRight: "0.5rem",
                fontSize: "35px",
                display: "inline-block",
                backgroundColor: "#3b82f6",
                borderRadius: "50%",
                padding: "0.25rem",
                color: "white",
              }}
            />{" "}
            www.facebook.com/bloodcellbd
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: "1660px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "50px",
            fontWeight: "900",
          }}
        >
          BLOODCELLBD
        </div>
      </div>
    );
  }
);

export default ReqFulfilledCertificate;
