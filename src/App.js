import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState, useMemo } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [newText, setNewText] = useState('');
  const [messagDelet, setMessagDelet] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filter, setFilter] = useState('all');

  function add() {
    if (input.length > 0) {
      setItems([...items, { id: items.length, text: input, isCompleted: false }]);
      localStorage.setItem('items', JSON.stringify(items));
      setInput('');
    }
  }

  function deleteItem(itemId) {
    setItemToDelete(itemId);
    setMessagDelet(true);
  }

  function confirmDelet() {
    if (itemToDelete !== null) {
      const updatedItems = items.filter((item) => item.id !== itemToDelete);
      setItems(updatedItems);
      localStorage.setItem('items', JSON.stringify(updatedItems));
      setMessagDelet(false);
      setItemToDelete(null);
    }
  }

  function noDelet() {
    setMessagDelet(false);
    setItemToDelete(null);
  }

  function edit(item) {
    setEditItem(item);
    setNewText(item.text);
  }

  function savEdit() {
    setItems(items.map((item) =>
      item.id === editItem.id ? { ...item, text: newText } : item
    ));
    setEditItem(null);
    setNewText('');
  }

  function cancelEdit() {
    setEditItem(null);
  }

  function toggleComplet(id) {
    setItems(items.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  }

  const itemsFilter = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'completed') return item.isCompleted;
      if (filter === 'incompleted') return !item.isCompleted;
      return true;
    });
  }, [items, filter]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: '#fefefe',
      width: '350px',
      padding: '30px 20px',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ textAlign: 'center' }}>مهامي</h1>
        <div>
          {['all', 'completed', 'incompleted'].map((f, i) => (
            <button
              key={i}
              style={{
                background: '#4caf50',
                color: 'white',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                padding: '6px 12px',
                marginRight: '8px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'الكل' : f === 'completed' ? 'منجز' : 'غير منجز'}
            </button>
          ))}
        </div>
      </div>

      <div>
        {itemsFilter.map((item) => (
          <div key={item.id} style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #ddd',
            width: '100%'
          }}>
            <p style={{ textDecoration: item.isCompleted ? "line-through" : "none" }}>{item.text}</p>
            <div>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => edit(item)} />
              <FontAwesomeIcon icon={faCheckCircle} style={{
                marginRight: '10px',
                cursor: 'pointer',
                color: item.isCompleted ? "#4caf50" : "#ccc"
              }} onClick={() => toggleComplet(item.id)} />
              <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer', color: 'red' }} onClick={() => deleteItem(item.id)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <button onClick={add} style={{
          background: '#4caf50',
          color: 'white',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          padding: '6px 15px',
          marginRight: '8px',
          fontSize: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>اضافه</button>
        <input
          type='text'
          placeholder='ادخل المهمه'
          style={{
            marginLeft: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            outline: 'none',
            transition: 'transform 0.2s ease',
            width: '160px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
          }}
          onFocus={(e) => e.target.style.transform = 'scale(1.05)'}
          onBlur={(e) => e.target.style.transform = 'scale(1)'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {editItem && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          zIndex: '1000',
          width: '250px',
          textAlign: 'center'
        }}>
          <h3>تعديل المهمه</h3>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '10px',
              width: '100%'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <button onClick={savEdit} style={{
              background: '#4caf50',
              color: 'white',
              padding: '6px 12px',
              marginRight: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>حفظ</button>
            <button onClick={cancelEdit} style={{
              background: '#f44336',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>الغاء</button>
          </div>
        </div>
      )}

      {messagDelet && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '15px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          zIndex: '1000',
          width: '250px',
          textAlign: 'center'
        }}>
          <h3>هل أنت متأكد من الحذف؟</h3>
          <div style={{ marginTop: '10px' }}>
            <button onClick={confirmDelet} style={{
              background: '#4caf50',
              color: 'white',
              padding: '6px 12px',
              marginRight: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>تأكيد</button>
            <button onClick={noDelet} style={{
              background: '#f44336',
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>رجوع</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
