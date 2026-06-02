import { useState } from 'react';
import { ShortCard } from '../components/short-card.tsx';
import { cities, synagogues } from '../utiles/maps.tsx';
import styles from '../App.module.css';
import type { User } from '../models/user.ts';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const isAdmin = urlParams.get('isAdmin') == 'true';



function Home() {
    const [items, setItems] = useState<User[]>([]);
    const [searchPhone, setSearchPhone] = useState('');
    const [searchName, setSearchName] = useState('');
    const [synagogue, setSynagogue] = useState('');
    const [city, setCity] = useState('');
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const base = import.meta.env.VITE_BASE_URL;
    const shulURL = base + 'search/shul';
    const phoneURL = base + 'search/phone';
    const nameURL = base + 'search/name';

    function filterByPhone(number: string, currentSynagogue: string = synagogue, currentCity: string = city) {
        fetch(`${phoneURL}?number=${number}&shul=${currentSynagogue}&city=${currentCity}`)
            .then(res => res.json())
            .then(data => {
                setItems(data);
            });
    }

    function filterByName(name: string, currentSynagogue: string = synagogue, currentCity: string = city) {
        fetch(`${nameURL}?fullname=${name}&shul=${currentSynagogue}&city=${currentCity}`)
            .then(res => res.json())
            .then(data => {
                setItems(data);
            });

    }

    function setAllItems() {
        fetch(base)
            .then(res => res.json())
            .then(data => {
                setItems(data);
                const cities = Array.from(new Set(data.map((item: any) => item.city)));
                console.log(cities);

            });
    }

    function searchByPlace(synagogue: string, city: string) {
        if (searchPhone) {
            filterByPhone(searchPhone, synagogue, city);
        } else if (searchName) {
            filterByName(searchName, synagogue, city);
        } else if (synagogue) {
            fetch(`${shulURL}?shul=${synagogue}&city=${city}`)
                .then(res => res.json())
                .then(data => {
                    setItems(data);
                });
        }
    }

    return (
        <div className="App">
            <h1>רשימת אנ"ש</h1>

            <div>
                <input
                    type="text"
                    id="phone"
                    placeholder="הכנס מספר או חלק ממספר טלפון"
                    className={styles.searchInput}
                    onChange={(e) => {
                        setSearchPhone(e.target.value);
                        setSearchName('');
                    }}
                    value={searchPhone}
                />
                <button className={styles.searchButton} onClick={() => filterByPhone(searchPhone)}>חפש לפי טלפון</button>
            </div>

            <div>
                <input
                    type="text"
                    id="name"
                    placeholder="הכנס שם (חיפוש חופשי)"
                    className={styles.searchInput}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setSearchPhone('');
                    }}
                    value={searchName}
                />
                <button className={styles.searchButton} onClick={() => filterByName(searchName)}>חפש לפי שם</button>
            </div>


            <button
                className={styles.searchButton}
                onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
                {showMoreFilters ? "הסתר סינונים נוספים" : "הצג סינונים נוספים"}
            </button>
            {showMoreFilters && <div>

                <select
                    id="synagogue"
                    className={styles.searchSelect}
                    value={synagogue}
                    onChange={(e) => {
                        setCity('');
                        setSynagogue(e.target.value);
                        searchByPlace(e.target.value, '');
                    }}
                >
                    <option value="">כל בתי הכנסת</option>
                    {synagogues.map(synagogue => (
                        <option key={synagogue.value} value={synagogue.value}>
                            {synagogue.lable}
                        </option>
                    ))}
                </select>
                <select
                    id="city"
                    className={styles.searchSelect}
                    value={city}
                    onChange={(e) => {
                        setSynagogue('');
                        setCity(e.target.value);
                        searchByPlace('', e.target.value);
                    }}
                >
                    <option value="">כל הערים</option>
                    {cities.map(city => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>}
            {items?.length > 0 && <div className={styles.searchContainer}>
                <h3>נמצאו {items.length} תוצאות</h3>
                <ul>
                    {items.map(
                        item => <div key={item.id}>
                            <ShortCard item={item} isAdmin={isAdmin} />
                        </div>
                    )}
                </ul>
            </div>
            }
            {items?.length === 0 && <div>
                <p>לא נמצאו תוצאות</p>
                <button className={styles.searchButton} onClick={() => setAllItems()}>הצג את כל הרשימה</button>
            </div>}

        </div>
    );
}

export default Home