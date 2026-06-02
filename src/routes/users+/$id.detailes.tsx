import { useParams } from "react-router";
import { useState, useEffect } from "react";
import type { User } from "../../models/user.ts";
import { Card } from "../../components/card.tsx";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isAdmin = urlParams.get('isAdmin') == 'true';


export default function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const base = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();
  useEffect(() => {
    fetch(`${base}/${id}?isAdmin=${isAdmin}`)
      .then(res => res.json())
      .then(data => {
        console.log("user data", data);
        setUser(data);
      });
  }, [id]);

  return (
    user ? <Card item={user} isAdmin={isAdmin} /> : <h1>loading...</h1>
  );
}
