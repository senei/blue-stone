import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

const DATA_KEY = 'localStorageData'

function JsonListItem({ name, number, description }) {
  return <span> <b>{name}</b> - {number} <br /> <small>{description}</small></span>
}
function JsonListItemEdit({ id, name, number, description, images, onChange }) {
  const [_name, setName] = useState(name);
  const [_num, setNumber] = useState(number);
  const [_desc, setDescription] = useState(description);
  const [_imgArr, setImages] = useState(images);

  const imageEdit = (key, item, value) => {
    let newArr = [..._imgArr];
    newArr[key][item] = value;
    setImages(newArr);
  }

  const buttonClick = () => {
    const main = {
      name: _name,
      number: _num,
      description: _desc,
    }
    onChange(id, main, _imgArr);
  }

  return <div>
    <input type="hidden" name="key" value={id} /><button onClick={buttonClick}>save</button><br />
    <input type="text" name="name" value={_name} onChange={(e) => { setName(e.target.value) }} /><br />
    <input type="text" name="number" value={_num} onChange={(e) => { setNumber(e.target.value) }} /><br />
    <textarea style={{ width: '400px' }} cols={"40"} rows={"2"} name="description" value={_desc} onChange={(e) => { setDescription(e.target.value) }} /><br />
    <ul>
      {images.map((img, key) => {
        return (<li key={'img' + key}>
          <img src={img.url} alt={img.name} height={"40"} />
          <input type="text" style={{ width: '400px' }} name="name" value={img.name} onChange={(e) => { imageEdit(key, "name", e.target.value) }} /><br />
          <input type="text" style={{ width: '400px' }} name="url" value={img.url} onChange={(e) => { imageEdit(key, "url", e.target.value) }} /><br />
        </li>)
      })}
    </ul>
    <hr />
  </div>
}

function App() {
  const [edit, setEdit] = useState(-1)
  const [data, setData] = useState(() => {
    const stickyValue = window.localStorage.getItem(DATA_KEY)
    return stickyValue !== null ? JSON.parse(stickyValue) : {}
  })
  useEffect(() => {
    console.info('setItem', DATA_KEY, data)
    window.localStorage.setItem(DATA_KEY, JSON.stringify(data))
    setEdit(-1)

  }, data)

  useEffect(() => {
    fetch('/assets/data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        if (Object.keys(data).length < 2) {
          window.localStorage.setItem(DATA_KEY, JSON.stringify(jsonData))
          setData(jsonData)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }, [])

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" height={40} />
      <ul data-edit={edit}>
        {data.map((item, key) => {
          return (
            <li key={key} >
              <span onClick={(e) => setEdit(key)}><small>
                ({key}) {edit === key && 'is - editeble'}
              </small>
                {edit !== key && <JsonListItem {...item} />}</span>
              {edit === key && <JsonListItemEdit {...item} id={key} onChange={(id, main, images) => {
                const objChanged = { ...main, images }
                let _arr = data;
                _arr[id] = objChanged;
                setData([..._arr])
              }} />}
              <hr />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
