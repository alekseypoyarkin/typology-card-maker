import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Upload, Download } from 'lucide-react';
import './index.css';

import cardBackground from './images/card-background.svg';
import circle from './images/circle.png';

// --- Data for Dropdowns ---
const typologyData = {
  enneagram: ["1w2", "2w1", "2w3", "3w2", "3w4", "4w3", "4w5", "5w4", "5w6", "6w5", "6w7", "7w6", "7w8", "8w7", "8w9", "9w8", "9w1"],
  psychosophy: ["LFEV", "FVEL", "VEFL", "EVLF", "LVEF", "VLEF", "ELVF", "LEVF", "FELV", "EFVL", "VFEL", "FVLE", "EFLV", "LFVE", "VELF", "EVFL"],
  socionics: ["ILE", "SEI", "ESE", "LII", "EIE", "LSI", "SEE", "ILI", "LIE", "ESI", "EII", "LSE", "SLE", "IEI", "IEE", "SLI"],
  alignment: ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"],
  jung: ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"],
  big5: ["RCUAI", "RLUAI", "RCOAI", "RLOAI", "RCUEI", "RLUEI", "RCOEI", "RLOEI", "SCUAI", "SLUAI", "SCOAI", "SLOAI", "SCUEI", "SLUEI", "SCOEI", "SLOEI"],
};

// --- Helper Components ---
const PixelatedCard = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-400 p-1 ${className}`}>
    {children}
  </div>
);

const PixelatedButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      font-pixel text-lg text-white dark:text-black bg-purple-600 dark:bg-purple-300
      border-2 border-black dark:border-gray-400
      px-6 py-3
      hover:bg-purple-700 dark:hover:bg-purple-400
      active:translate-y-px active:translate-x-px
      transition-all duration-150
      flex items-center justify-center gap-3
      ${className}
    `}
  >
    {children}
  </button>
);

const CustomSelect = ({ label, value, onChange, options, name }) => (
    <div className="flex items-center justify-between gap-2">
        <label htmlFor={name} className="font-pixel text-sm sm:text-base text-gray-700 dark:text-gray-300 uppercase tracking-widest flex-shrink-0">
            {label}
        </label>
        <div className="relative w-full max-w-[160px] sm:max-w-[200px]">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="
                    font-pixel text-sm sm:text-base appearance-none w-full bg-white dark:bg-gray-700
                    border-2 border-black dark:border-gray-500
                    text-purple-600 dark:text-purple-300
                    py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500
                "
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black dark:text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    </div>
);


// --- Main App Component ---
function TypologyIdCardGenerator() {
  
  const [rectColor, setRectColor] = useState("#0000FF");
  const upperRowRef = useRef(null);
  const textColor = getTextColor(rectColor);
  const element = document.getElementById('upper-row');
  const [value, setValue] = useState('');


  // Функция для сохранения изображения

  function getTextColor(bgColor) {

  // Функция вычисляет читаемость цвета текста на фоне

  const r = parseInt(bgColor.substr(1,2),16);

  const g = parseInt(bgColor.substr(3,2),16);

  const b = parseInt(bgColor.substr(5,2),16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 170 ? "#222" : "#fff";

}

function getFontFromComputedStyle(element) {
  const style = window.getComputedStyle(element);
  let font = style.getPropertyValue('font');
  if (!font) { // В Firefox style.font может быть пустым
    const fontStyle = style.getPropertyValue('font-style') || 'normal';
    const fontVariant = style.getPropertyValue('font-variant') || 'normal';
    const fontWeight = style.getPropertyValue('font-weight') || 'normal';
    const fontSize = style.getPropertyValue('font-size') || '16px';
    const lineHeight = style.getPropertyValue('line-height') || 'normal';
    // Явно используем имя вашего шрифта
    const fontFamily = "'CHNOPixelCodePro', monospace";

    font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`.trim();
  }
  return font;
}



const handleSaveClick = () => {
  if (!upperRowRef.current) return;

  toPng(upperRowRef.current, { cacheBust: true })
    .then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "screenshot.png";
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error("Ошибка:", err);
    });
};


  const [cardData, setCardData] = useState({
    name: 'YOUR NAME',
    photo: null,
    enneagram: 'xxXwX',
    psychosophy: 'XXXX',
    socionics: 'XXX',
    alignment: 'X X',
    jung: 'XX(X)',
    big5: 'XXXXX',
  });
  const [openSelect, setOpenSelect] = useState(null); // для отслеживания открытого меню
  const idCardRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
    setOpenSelect(null); // закрыть меню после выбора
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCardData(prev => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

const onDownload = useCallback(() => {
    if (idCardRef.current === null) {
        console.error('ID Card ref is null');
        return;
    }
    toPng(idCardRef.current, { cacheBust: true, backgroundColor: '#4c1d95' })
        .then((dataUrl) => {
            console.log('Downloaded image URL:', dataUrl); // Логируем URL
            const link = document.createElement('a');
            link.download = 'typology-id-card.png';
            link.href = dataUrl;
            link.click();
        })
        .catch((err) => {
            console.error('Error generating image:', err);
        });
}, [idCardRef]);

  return (
    <div

      style={{

        minHeight: "100vh",

        minWidth: "100vw",

        background: "#000",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

      }}

    >

    
    <div
      style={{

          transform: "scale(0.7)",

          transformOrigin: "center",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",
          marginTop: '-125px',

        }}
    >
      <div 
      
          ref={upperRowRef}

          id="upper-row"
      style={{

    display: 'flex',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
    marginTop: 0,

  }}>
      {/* Левый прямоугольник */}
      <div
        style={{
          width: 1356.5,
          height: 1001.92,
          background: rectColor,
          borderRadius: 48,
          marginRight: 32,
          position: 'relative',
        }}
      >
        {/* Заголовок */}
        <div
          style={{
            width: 1229.13,
            height: 120,
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            flexDirection: 'column',
            paddingTop: 16,
          }}
        >
          {/* Заглавная надпись */}
          <span
            style={{
              color: textColor,
              fontFamily: "Arial",
              fontSize: 90, // как у надписей слева
              letterSpacing: 4,
              textAlign: 'center',
              width: '100%',
              width: 'fit-content',
              userSelect: 'none',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            TYPOLOGY IDENTITY CARD
          </span>
          <span
            style={{
              color: textColor,
              fontFamily: "Arial",
              fontSize: 18, // как у надписей слева
              letterSpacing: 4,
              textAlign: 'center',
              width: '100%',
              width: 'fit-content',
              userSelect: 'none',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              opacity: 0.3,
              paddingTop: 7,
            }}
          >
            by @farafona & @keyseee
          </span>
        </div>
        {/* Пунктирная линия */}
        <div
            style={{
            position: 'absolute',
            top: `calc(1001.92px - 8 * 104px)`,
            left: 0,
            width: '100%',
            height: '7px', // Высота контейнера для псевдоэлементов
            background: `linear-gradient(to right, #fff 50%, transparent 50%)`,
            backgroundSize: '22px 100%', // Размер между черточками
            zIndex: 2,
          }}
        />
        {/* 8 белых прямоугольников с синим пунктиром и полями ввода текста */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 104, // выравниваем по нижней границе синего прямоугольника
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            zIndex: 3,
            justifyContent: 'flex-end',
          }}
        >
          {[
            { key: "enneagram", label: "ENNEAGRAM" },
            { key: "psychosophy", label: "PSYCHOSOPHY" },
            { key: "socionics", label: "SOCIONICS" },
            { key: "alignment", label: "ALIGNMENT" },
            { key: "jung", label: "JUNG" },
            { key: "big5", label: "BIG5" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 0,
              }}
            >
              {/* Белый прямоугольник с текстовым полем */}
              <div
                style={{
                  width: 642,
                  height: 104,
                  background: '#fff',
                  border: `4px dashed ${rectColor}`,
                  marginLeft: 0,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 8,
                  position: 'relative',
                }}
              >
                <input
                  type="text"
                  name={item.key}
                  onChange={e => setValue(e.target.value)}
                  style={{
                    width: '100%',
                    height: '70%',
                    fontFamily: "Arial",
                    fontSize: 48,
                    letterSpacing: 2,
                    color: '#000',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    textAlign: 'right',
                    paddingRight: 8,
                  }}
                  maxLength={32}
                  autoComplete="off"
                  placeholder={cardData[item.key] || ""}
                />
              </div>
              {/* Подпись справа от прямоугольника */}
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 45,
                  fontFamily: "Arial",
                  fontSize: 90,
                  letterSpacing: 4,
                  color: textColor,
                  userSelect: 'none',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                  minWidth: 320,
                  height: 104,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div>
          <img

                src={circle}

                alt="Описание картинки"

                style={{

                    position: 'absolute',

                    bottom: '0',

                    right: '0',

                    width: '413px', // Можете задать фиксированную ширину

                    height: '418.9px', // Или фиксированную высоту
                    scale: 1.15,

                    maxWidth: '100%', // Чтобы изображение не выходило за пределы

                    maxHeight: '100%', // И не искажалось
                    marginBottom: 35,
                    marginRight: 50,

                }}

            />
        </div>
      </div>
      {/* Правый прямоугольник */}
      <div
        style={{
          width: 516.19,
          height: 1001.92,
          background: rectColor,
          borderRadius: 48,
          position: 'relative',
        }}
      >
        {/* Надпись NAME: над верхним белым прямоугольником */}
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 140.69 - 104,
            transform: 'none',
            fontFamily: "Arial",
            fontSize: 90, // как у надписей слева
            letterSpacing: 4,
            color: textColor,
            userSelect: 'none',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textAlign: 'left',
            zIndex: 3,
            paddingLeft: 48,
          }}
        >
          NAME:
        </span>
        {/* Верхний белый прямоугольник */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: `calc(1001.92px - 8 * 104px)`, // верхняя граница совпадает с пунктирной линией
            transform: 'translateX(-50%)',
            width: 518,
            height: 104,
            background: '#fff',
            border: `4px dashed ${rectColor}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            style={{
              width: '90%',
              height: '70%',
              fontFamily: "Arial",
              fontSize: 56,
              letterSpacing: 2,
              color: '#000', // черный текст
              border: 'none',
              background: 'transparent',
              outline: 'none',
              textAlign: 'left', // выравнивание по левому краю
              paddingLeft: 16,
            }}
            maxLength={32}
            autoComplete="off"
            placeholder={cardData.name}
          />
        </div>
        {/* Надпись PHOTO: над нижним белым прямоугольником */}
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 1001.92 - 516 - 145,
            transform: 'none',
            fontFamily: "Arial",
            fontSize: 90, // как у надписей слева
            letterSpacing: 4,
            color: textColor,
            userSelect: 'none',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textAlign: 'left',
            zIndex: 3,
            paddingLeft: 48,
          }}
        >
          PHOTO:
        </span>
        {/* Белый прямоугольник внизу */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: 519,
            height: 516,
            background: '#fff',
            border: `4px dashed ${rectColor}`,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={() => {
            // Клик по прямоугольнику вызывает клик по скрытому input
            document.getElementById('photo-upload-input').click();
          }}
        >
          <input

                id="photo-upload-input"

                type="file"

                accept="image/*"

                style={{ display: "none" }}

                onChange={handlePhotoUpload}

              />

              {cardData.photo ? (

                <div style={{

                  position: "relative",
                  display: "flex",

                  width: "100%",

                  height: "100%",
                  justifyContent: 'center', alignItems: 'center'

                }}>

                  <img

                    src={cardData.photo}

                    style={{

                      width: "96%",

                      height: "96%",



                      position: "center",

                      top: 0,

                      left: 0

                    }}

                    crossOrigin="anonymous"

                  />

                </div>

              ) : (

                <span

                  style={{

                    color: '#000000',

                    fontFamily: "Arial",

                    fontSize: 48,

                    opacity: 0.25,

                    userSelect: "none",

                    textAlign: "center"

                  }}

                >
              Click to upload photo
            </span>
          )}
        </div>
      </div>
      </div>
      {/* Третий (нижний) прямоугольник */}

  <div

        style={{

          marginTop: 32,

          width: 1904.69,

          height: 180,

          background: "#222222",

          borderRadius: 48,

          position: "relative",

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          padding: "0 32px"

        }}

      >

        {/* Слева color picker */}

        <div style={{

          display: "flex",

          alignItems: "center"

        }}>

          <label style={{color: "#fff", marginRight: 12, fontSize: 48, 
            fontFamily: "Arial",}}>

            Card Color:
          </label>

          <input

            type="color"

            value={rectColor}

            onChange={(e) => setRectColor(e.target.value)}

            style={{width: 40, height: 40, border: "none", outline: "none", marginTop: 15,}}

          />

        </div>

        {/* Справа кнопка сохранения */}

        <button

          onClick={handleSaveClick}

          style={{

            padding: "16px 32px",

            borderRadius: 16,

            border: "none",

            background: "#fff",

            color: "#000000",

            fontWeight: "bold",

            fontSize: 32,

            cursor: "pointer",
            fontFamily: "Arial",


          }}

        >

          Save Card (beta)

        </button>

      </div>
    <div style={{marginTop:10, }}>
      <span style={{color: '#222222', }}>typology-card-maker v0.0.1 </span>
      <a href="https://github.com/alekseypoyarkin/typology-card-maker" 
         style={{ color: '#264c75ff', textDecoration: 'none' }} 
         target="_blank" 
         rel="noopener noreferrer">
        Github Repository
      </a>
    </div>
    </div>
    </div>
  );
}

export default TypologyIdCardGenerator;

