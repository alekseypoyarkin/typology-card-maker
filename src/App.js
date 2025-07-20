import React, { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import "./index.css";
import circle from "./images/circle.png";

// --- Main App Component ---
function TypologyIdCardGenerator() {
  // Функция для генерации абсолютно случайного цвета
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const [rectColor, setRectColor] = useState(generateRandomColor());
  const upperRowRef = useRef(null);
  const textColor = getTextColor(rectColor);
  const [value, setValue] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Отслеживание изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функция для сохранения изображения

  function getTextColor(bgColor) {
    // Функция вычисляет читаемость цвета текста на фоне

    const r = parseInt(bgColor.substr(1, 2), 16);

    const g = parseInt(bgColor.substr(3, 2), 16);

    const b = parseInt(bgColor.substr(5, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 170 ? "#222" : "#fff";
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
    name: "YOUR NAME",
    photo: null,
    enneagram: "xxXwX",
    psychosophy: "XXXX",
    socionics: "XXX",
    alignment: "X X",
    jung: "XX(X)",
    big5: "XXXXX",
  });
  const [openSelect, setOpenSelect] = useState(null); // для отслеживания открытого меню
  const idCardRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
    setOpenSelect(null); // закрыть меню после выбора
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCardData((prev) => ({ ...prev, photo: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#000",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "10px",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "1920px",
          transform: `scale(${Math.min(1, Math.min((windowSize.width - 40) / 1920, (windowSize.height - 40) / 1200))})`,
          transformOrigin: "top center",
        }}
      >
        <div
          ref={upperRowRef}
          id="upper-row"
          style={{
            display: "flex",

            flexDirection: "row",

            alignItems: "center",

            justifyContent: "center",
            marginTop: 0,
          }}
        >
          {/* Левый прямоугольник */}
          <div
            style={{
              width: 1356.5,
              height: 1001.92,
              background: rectColor,
              borderRadius: 48,
              marginRight: 32,
              position: "relative",
            }}
          >
            {/* Заголовок */}
            <div
              style={{
                width: 1229.13,
                height: 120,
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                flexDirection: "column",
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
                  textAlign: "center",
                  width: "100%",
                  width: "fit-content",
                  userSelect: "none",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
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
                  textAlign: "center",
                  width: "100%",
                  width: "fit-content",
                  userSelect: "none",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
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
                position: "absolute",
                top: `calc(1001.92px - 8 * 104px)`,
                left: 0,
                width: "100%",
                height: "7px", // Высота контейнера для псевдоэлементов
                background: `linear-gradient(to right, #fff 50%, transparent 50%)`,
                backgroundSize: "22px 100%", // Размер между черточками
                zIndex: 2,
              }}
            />
            {/* 8 белых прямоугольников с синим пунктиром и полями ввода текста */}
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 104, // выравниваем по нижней границе синего прямоугольника
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 0,
                zIndex: 3,
                justifyContent: "flex-end",
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
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 0,
                  }}
                >
                  {/* Белый прямоугольник с текстовым полем */}
                  <div
                    style={{
                      width: 642,
                      height: 104,
                      background: "#fff",
                      border: `4px dashed ${rectColor}`,
                      marginLeft: 0,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: 8,
                      position: "relative",
                    }}
                  >
                    <input
                      type="text"
                      name={item.key}
                      onChange={(e) => setValue(e.target.value)}
                      style={{
                        width: "100%",
                        height: "70%",
                        fontFamily: "Arial",
                        fontSize: 48,
                        letterSpacing: 2,
                        color: "#000",
                        border: "none",
                        background: "transparent",
                        outline: "none",
                        textAlign: "right",
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
                      display: "inline-block",
                      marginLeft: 45,
                      fontFamily: "Arial",
                      fontSize: 90,
                      letterSpacing: 4,
                      color: textColor,
                      userSelect: "none",
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                      textAlign: "left",
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
                style={{
                  position: "absolute",

                  bottom: "0",

                  right: "0",

                  width: "413px", // Можете задать фиксированную ширину

                  height: "418.9px", // Или фиксированную высоту
                  scale: 1.15,
                  opacity: 0.65,
                  maxWidth: "100%", // Чтобы изображение не выходило за пределы

                  maxHeight: "100%", // И не искажалось
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
              position: "relative",
            }}
          >
            {/* Надпись NAME: над верхним белым прямоугольником */}
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 140.69 - 104,
                transform: "none",
                fontFamily: "Arial",
                fontSize: 90, // как у надписей слева
                letterSpacing: 4,
                color: textColor,
                userSelect: "none",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textAlign: "left",
                zIndex: 3,
                paddingLeft: 48,
              }}
            >
              NAME:
            </span>
            {/* Верхний белый прямоугольник */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: `calc(1001.92px - 8 * 104px)`, // верхняя граница совпадает с пунктирной линией
                transform: "translateX(-50%)",
                width: 518,
                height: 104,
                background: "#fff",
                border: `4px dashed ${rectColor}`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <input
                type="text"
                name="name"
                onChange={handleInputChange}
                style={{
                  width: "90%",
                  height: "70%",
                  fontFamily: "Arial",
                  fontSize: 56,
                  letterSpacing: 2,
                  color: "#000", // черный текст
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  textAlign: "left", // выравнивание по левому краю
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
                position: "absolute",
                left: 0,
                top: 1001.92 - 516 - 145,
                transform: "none",
                fontFamily: "Arial",
                fontSize: 90, // как у надписей слева
                letterSpacing: 4,
                color: textColor,
                userSelect: "none",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textAlign: "left",
                zIndex: 3,
                paddingLeft: 48,
              }}
            >
              PHOTO:
            </span>
            {/* Белый прямоугольник внизу */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: "translateX(-50%)",
                width: 519,
                height: 516,
                background: "#fff",
                border: `4px dashed ${rectColor}`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => {
                // Клик по прямоугольнику вызывает клик по скрытому input
                document.getElementById("photo-upload-input").click();
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
                <div
                  style={{
                    position: "relative",
                    display: "flex",

                    width: "100%",

                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={cardData.photo}
                    style={{
                      width: "96%",
                      objectFit: "contain",

                      height: "96%",

                      position: "center",

                      top: 0,
                      
                      left: 0,
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <span
                  style={{
                    color: "#000000",

                    fontFamily: "Arial",

                    fontSize: 48,

                    opacity: 0.25,

                    userSelect: "none",

                    textAlign: "center",
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

            padding: "0 32px",
          }}
        >
          {/* Слева color picker */}

          <div
            style={{
              display: "flex",

              alignItems: "center",
            }}
          >
            <label
              style={{
                color: "#fff",
                marginRight: 12,
                fontSize: 48,
                fontFamily: "Arial",
              }}
            >
              Card Color:
            </label>

            <input
              type="color"
              value={rectColor}
              onChange={(e) => setRectColor(e.target.value)}
              style={{
                width: 40,
                height: 40,
                border: "none",
                outline: "none",
                marginTop: 15,
              }}
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
        <div style={{ marginTop: 10 }}>
          <span style={{ color: "#222222", whiteSpace: "nowrap" }}>typology-card-maker v0.0.1 </span>
          <a
            href="https://github.com/alekseypoyarkin/typology-card-maker"
            style={{ color: "#264c75ff", textDecoration: "none", whiteSpace: "nowrap" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Github Repository
          </a>
        </div>
      </div>
    </div>
  );
}

export default TypologyIdCardGenerator;
