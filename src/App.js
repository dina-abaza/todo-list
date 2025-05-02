

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState,useMemo } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [newText, setNewText] = useState('');
  const [messagDelet, setMessagDelet] = useState(false);  // للتحكم في عرض رسالة التأكيد
  const [itemToDelete, setItemToDelete] = useState(null); // لتخزين id العنصر الذي سيتم حذفه
  const [filter, setFilter] = useState('all');

  // إضافة عنصر جديد
  function add() {
    if (input.length > 0) {
      setItems([...items, { id: items.length, text: input, isCompleted: false }]);
      localStorage.setItem('items', JSON.stringify(items));
      setInput('');
    }
  }

  // حذف العنصر المحدد (تخزين id العنصر في itemToDelete)
  function deleteItem(itemId) {
    setItemToDelete(itemId);
    setMessagDelet(true);  // عرض رسالة التأكيد
  }

  // تأكيد الحذف
  function confirmDelet() {
    if (itemToDelete !== null) {
      const updatedItems = items.filter((item) => item.id !== itemToDelete); // حذف العنصر باستخدام id
      setItems(updatedItems);
      localStorage.setItem('items', JSON.stringify(updatedItems)); // تحديث الـ localStorage
      setMessagDelet(false);  // إخفاء رسالة التأكيد بعد الحذف
      setItemToDelete(null);  // إعادة تعيين الـ id بعد الحذف
    }
  }

  // إلغاء الحذف
  function noDelet() {
    setMessagDelet(false); // إخفاء رسالة التأكيد عند إلغاء الحذف
    setItemToDelete(null); // إعادة تعيين الـ id عند إلغاء الحذف
  }

  // تعديل العنصر
  function edit(item) {
    setEditItem(item);
    setNewText(item.text);
  }

  // حفظ التعديل
  function savEdit() {
    setItems(items.map((item) =>
      item.id === editItem.id ? { ...item, text: newText } : item
    ));
    setEditItem(null);
    setNewText('');
  }

  // إلغاء التعديل
  function cancelEdit() {
    setEditItem(null);
  }

  // تغيير حالة إتمام المهمة
  function toggleComplet(id) {
    setItems(items.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  }

  // تصفية العناصر حسب الحالة (منجز / غير منجز)
 /*
 لنقل أنه لديك 1000 عنصر في القائمة، وأن عملية الفلترة قد تأخذ وقتًا طويلًا (على سبيل المثال، تتطلب عمليات معقدة). إذا كنت تستخدم useMemo، لن يتم حساب الفلترة في كل مرة يتم فيها إعادة تحديث واجهة المستخدم، بل فقط عندما يتغير شيء مهم مثل items أو filter. في الحالات الأخرى، سيتم إعادة استخدام النتيجة المحسوبة مسبقًا، مما يسرع الأداء.


*/
  const itemsFilter = useMemo(() => {
    return items.filter((item) => {
      if (filter === 'completed') return item.isCompleted;
      if (filter === 'incompleted') return !item.isCompleted;
      return true;  // عند اختيار "الكل"، نقوم بإرجاع جميع العناصر
    });
  }, [items, filter]);  // سيتم حساب النتيجة فقط إذا تغير `items` أو `filter`
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: 'beige',
      width: '300px',
      height: 'auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <div style={{ marginBottom: '50px' }}>
        <h1 style={{ textAlign: 'center' }}>مهامي</h1>
        <div>
          <button style={{ background: 'green', cursor: 'pointer', border: 'none', outline: 'none', padding: '5px 10px', marginRight: '8px' }} onClick={() => setFilter('all')}>الكل</button>
          <button style={{ background: 'green', cursor: 'pointer', border: 'none', outline: 'none', padding: '5px 10px', marginRight: '8px' }} onClick={() => setFilter('completed')}>منجز</button>
          <button style={{ background: 'green', cursor: 'pointer', border: 'none', outline: 'none', padding: '5px 10px', marginRight: '8px' }} onClick={() => setFilter('incompleted')}>غير منجز</button>
        </div>
      </div>

      <div>
        {itemsFilter.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: '100px', borderBottom: '1px solid #ccc', width: '100%' }}>
            <p style={{ textDecoration: item.isCompleted ? "line-through" : "none" }}>{item.text}</p>
            <div>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => edit(item)} />
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '10px', cursor: 'pointer', color: item.isCompleted ? "green" : "grey" }} onClick={() => toggleComplet(item.id)} />
              <FontAwesomeIcon
                icon={faTrash}
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => deleteItem(item.id)}  // تمرير الـ id للحذف
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <button onClick={add} style={{ background: 'green', cursor: 'pointer', border: 'none', outline: 'none', padding: '5px 15px', marginRight: '8px', fontSize: '18px' }}>اضافه</button>
        <input type='text' placeholder='ادخل المهمه' style={{ marginLeft: '50px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', outline: 'none', transition: 'transform 0.2s ease' }}
          onFocus={(e) => e.target.style.transform = 'scale(1.1)'}
          onBlur={(e) => e.target.style.transform = 'scale(1)'} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      {/* تعديل المهمة */}
      {editItem && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: '1000',
        }}>
          <h3>تعديل المهمه</h3>
          <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={savEdit} style={{ background: 'green', color: 'white', padding: '5px 10px', marginRight: '10px', cursor: 'pointer' }}>حفظ</button>
            <button onClick={cancelEdit} style={{ background: 'red', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>الغاء</button>
          </div>
        </div>
      )}

      {/* رسالة التأكيد للحذف */}
      {messagDelet && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: '1000',
        }}>
          <h3>هل أنت متأكد من الحذف؟</h3>
          <div>
            <button onClick={confirmDelet}>تأكيد</button>
            <button onClick={noDelet}>رجوع</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;