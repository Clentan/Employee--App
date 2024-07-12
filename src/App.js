import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    // Simulating initial data fetch (replace with actual API call if needed)
    const initialData = [
      { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com', telephone: '123-456-7890', position: 'Manager', number: '12345', packed: false, image: null },
      { id: 2, name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', telephone: '987-654-3210', position: 'Developer', number: '54321', packed: false, image: null }
    ];
    setItems(initialData);
  }, []);

  function handleDeleteItems(id) {
    setItems(items => items.filter(item => item.id !== id));
  }

  function handleAddItems(newItem) {
    if (editMode) {
      setItems(items.map(item => item.id === editItem.id ? newItem : item));
      setEditMode(false);
      setEditItem(null);
    } else {
      setItems([...items, newItem]);
    }
  }

  function handleViewProfile(item) {
    setSelectedProfile(item);
  }

  function handleBack() {
    setSelectedProfile(null);
  }

  function handleSearch(id) {
    const foundItem = items.find(item => item.id === parseInt(id, 10));
    if (foundItem) {
      setSelectedProfile(foundItem);
    } else {
      alert('Employee not found');
    }
  }

  function handleEditItem(item) {
    setEditMode(true);
    setEditItem(item);
  }

  return (
    <div className="App">
      {selectedProfile ? (
        <Profile item={selectedProfile} onBack={handleBack} />
      ) : (
        <>
          <Header name="Employee List" />
          <Search onSearch={handleSearch} />
          <Form onAddItems={handleAddItems} editMode={editMode} editItem={editItem} />
          <PackingList items={items} onViewProfile={handleViewProfile} onDeleteItem={handleDeleteItems} onEditItem={handleEditItem} />
        </>
      )}
    </div>
  );
}

function Header({ name }) {
  return <h1 className="header">{name}</h1>;
}

function Form({ onAddItems, editMode, editItem }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [position, setPosition] = useState('');
  const [number, setNumber] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editMode && editItem) {
      setName(editItem.name);
      setSurname(editItem.surname);
      setEmail(editItem.email);
      setTelephone(editItem.telephone);
      setPosition(editItem.position);
      setNumber(editItem.number);
      setImage(editItem.image);
    }
  }, [editMode, editItem]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !surname || !email) {
      alert('Please fill out all required fields: Name, Surname, Email');
      return;
    }

    const newItem = {
      id: editMode ? editItem.id : Date.now(),
      name,
      surname,
      email,
      telephone,
      position,
      number,
      packed: false,
      image
    };
    onAddItems(newItem);

    setName('');
    setSurname('');
    setEmail('');
    setTelephone('');
    setPosition('');
    setNumber('');
    setImage(null);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">Name *</label>
        <input
          className="form-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="form-label">Surname *</label>
        <input
          className="form-input"
          type="text"
          placeholder="Enter your surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <label className="form-label">Email Address *</label>
        <input
          className="form-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="form-label">Telephone</label>
        <input
          className="form-input"
          type="tel"
          placeholder="Enter your telephone number"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
        <label className="form-label">Employee Position*</label>
        <input
          className="form-input"
          type="text"
          placeholder="Enter employee position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <label className="form-label">Identity Number</label>
        <input
          className="form-input"
          type="text"
          placeholder="Enter identity number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <label className="form-label">Upload Image</label>
        <input
          className="form-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button className="form-button" type="submit">{editMode ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

function PackingList({ items, onViewProfile, onDeleteItem, onEditItem }) {
  return (
    <ul className="packing-list">
      {items.map((item) => (
        <Item key={item.id} item={item} onViewProfile={onViewProfile} onDeleteItem={onDeleteItem} onEditItem={onEditItem} />
      ))}
    </ul>
  );
}

function Item({ item, onViewProfile, onDeleteItem, onEditItem }) {
  return (
    <li className="item">
      {item.name} {item.surname} - {item.email}
      {item.image && (
        <img src={item.image} alt="Uploaded" style={{ maxWidth: '100px', marginLeft: '10px' }} />
      )}
      <div className='view-delete-update'>
        <button className="view-profile-button" onClick={() => onViewProfile(item)}>
          View Profile
        </button>
        <button className="delete-profile-button" onClick={() => onDeleteItem(item.id)}>
          Delete
        </button>
        
        <input type='checkbox' className="edit-profile-button" onClick={() => onEditItem(item)}>
        
        </input>
        <label>EDIT</label>
      </div>
    </li>
  );
}

function Profile({ item, onBack }) {
  return (
    <div className="profile">
      <button className="back-button" onClick={onBack}>Back</button>
      <div className="profile-header">
        <img src={item.image} alt="Profile" style={{ maxWidth: '100px', borderRadius: '50%' }} />
        <div>
          <h2>{item.name} {item.surname}</h2>
          <p>{item.position}</p>
        </div>
      </div>
      <div className="profile-details">
        <p>Email: {item.email}</p>
        <p>Telephone: {item.telephone}</p>
        <p>Position: {item.position}</p>
        <p>Identity Number: {item.number}</p>
      </div>
    </div>
  );
}

function Search({ onSearch }) {
  const [searchId, setSearchId] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchId) {
      onSearch(searchId);
    }
  }

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search by ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default App;
