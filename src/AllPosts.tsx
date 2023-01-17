import React from "react";
import { useParams } from "react-router";

export default function AllPosts () {
    const { pageNumber } = useParams();
    return <h2>All Posts; Page: {pageNumber} </h2>;
};