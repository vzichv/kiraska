import "./avito.css";

import * as React from "react";
import XLSX from "xlsx";
import findIndex from "lodash/findIndex";

const contacts = {
  SPB: {
    managerName: "Леонид",
    phone: "8-904-643-43-05",
    address: "Санкт-Петербург, ул. Минеральная, д. 31Ж",
  },
  MSK: {
    managerName: "Леонид",
    phone: "8-950-662-61-00",
    address: "Россия, Московская область, Одинцово, Можайское шоссе, 8Г",
  },
};

class Avito extends React.Component {
  state = {
    loading: false,
    isLoaded: false,
    imagesLoaded: false,
    data: [],
    fileName: null,
    vendorCodeIndex: null,
    titleIndex: null,
    groupIndex: null,
    kindOfItemIndex: null,
    brandIndex: null,
    modelIndex: null,
    OemIndex: null,
    manufacturerIndex: null,
    priceIndex: null,
    linkToPhotoIndex: null,
    allBrands: [],
    allModels: [],
    allGroups: [],
    city: "SPB",
    managerName: "Леонид",
    phone: "89046434305",
    address: "Санкт-Петербург, ул. Минеральная, д. 31Ж",
    parseErrors: [],
    paid: true,
  };

  loading = (file) => this.setState({ loading: true }, this.handleFile(file));

  handleFile = (file) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      if (typeof file.name === "string") {
        this.setState({ fileName: file.name });
      }
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        cellText: false,
        type: rABS ? "binary" : "array",
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      this.setState({ data: data }, () => {
        this.setState(
          {
            vendorCodeIndex: findIndex(data[0], (i) => i === "Артикул"),
            titleIndex: findIndex(data[0], (i) => i === "Рабочее наименование"),
            groupIndex: findIndex(
              data[0],
              (i) => i === "Номенклатура.Подкатегория Авито"
            ),
            kindOfItemIndex: findIndex(
              data[0],
              (i) => i === "Вид номенклатуры"
            ),
            brandIndex: findIndex(data[0], (i) => i === "Марка"),
            modelIndex: findIndex(data[0], (i) => i === "Модель"),
            OemIndex: findIndex(data[0], (i) => i === "ОЕМ номер"),
            manufacturerIndex: findIndex(data[0], (i) => i === "Производитель"),
            priceIndex: findIndex(data[0], (i) => i === "Цена"),
            linkToPhotoIndex: findIndex(data[0], (i) => i === "Ссылка на фото"),
          },
          this.setState({ isLoaded: true, loading: false })
        );
      });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  generateXml = (data, filename, mime) => {
    let blob = new Blob([data], { type: mime || "application/octet-stream" });
    let blobURL = window.URL.createObjectURL(blob);
    let tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  };

  changePaid = () => this.setState({ paid: !this.state.paid });
  changeManagerName = (event) =>
    this.setState({ managerName: event.target.value });
  changePhone = (event) => this.setState({ phone: event.target.value });
  changeAddress = (event) => this.setState({ address: event.target.value });
  changeCity = (city) => {
    this.changeContacts(city);
    this.setState({ city });
  };
  changeContacts = (city) => {
    this.setState({
      managerName: contacts[city].managerName,
      phone: contacts[city].phone,
      address: contacts[city].address,
    });
  };

  typeId = (type) => {
    switch (type) {
      case "Двери":
        return "16-808";
      case "Капоты":
      case "Капот":
        return "16-814";
      case "Крылья":
        return "16-816";
      case "Крышки багажника":
      case "Крышка, дверь багажника":
        return "16-818";
      case "Лонжероны":
      case "Балки задние":
      case "Балки, лонжероны":
        return "16-805";
      case "Подрамники":
      case "Рама":
        return "16-824";
      case "Пороги":
        return "16-823";
      case "Усилители бампера":
      case "Бампера":
      case "Бамперы":
        return "16-806";
      case "Панели боковые":
      case "Панели задние":
      case "Панели передние":
      case "Кузов по частям":
        return "16-819";
      case "Накладки капота":
      case "Накладки":
      case "Молдинги, накладки":
        return "16-822";
      case "Решетки радиатора":
      case "Решетка радиатора":
        return "16-825";
      case "Брызговики":
        return "16-807";
      case "Зеркала":
        return "16-812";
      case "Патрубки":
      case "Патрубки вентиляции":
        return "16-837";
      case "Автосвет":
      case "Оптика":
        return "11-618";
      case "Аккумуляторы":
        return "11-619";
      case "Блок цилиндров, головка, картер":
        return "16-827";
      case "Вакуумная система":
        return "16-828";
      case "Генераторы, стартеры":
        return "16-829";
      case "Двигатель в сборе":
        return "16-830";
      case "Катушка зажигания, свечи, электрика":
        return "16-831";
      case "Клапанная крышка":
        return "16-832";
      case "Коленвал, маховик":
        return "16-833";
      case "Коллекторы":
        return "16-834";
      case "Крепление двигателя":
        return "16-835";
      case "Масляный насос, система смазки":
        return "16-836";
      case "Поршни, шатуны, кольца":
        return "16-838";
      case "Приводные ремни, натяжители":
        return "16-839";
      case "Прокладки и ремкомплекты":
        return "16-840";
      case "Ремни, цепи, элементы ГРМ":
        return "16-841";
      case "Турбины, компрессоры":
        return "16-842";
      case "Электродвигатели и компоненты":
        return "16-843";
      case "Запчасти для ТО":
        return "11-621";
      case "Заглушки":
        return "16-809";
      case "Замки":
        return "16-810";
      case "Защита":
        return "16-811";
      case "Кабина":
        return "16-813";
      case "Крепления":
        return "16-815";
      case "Крыша":
        return "16-817";
      case "Кузов целиком":
        return "16-820";
      case "Лючок бензобака":
        return "16-821";
      case "Стойка кузова":
        return "16-826";
      case "Подвеска":
        return "11-623";
      case "Рулевое управление":
        return "11-624";
      case "Салон":
        return "11-625";
      case "Система охлаждения":
      case "Радиаторы":
        return "16-521";
      case "Стекла":
        return "11-626";
      case "Топливная и выхлопная системы":
        return "11-627";
      case "Тормозная система":
        return "11-628";
      case "Трансмиссия и привод":
        return "11-629";
      case "Электрооборудование":
        return "11-630";
      case "Для мототехники":
        return "6-401";
      case "Для спецтехники":
        return "6-406";
      case "Для водного транспорта":
        return "6-411";
      case "Аксессуары":
        return "4-943";
      case "GPS-навигаторы":
        return "21";
      case "Автокосметика и автохимия":
        return "4-942";
      case "Аудио- и видеотехника":
        return "20";
      case "Багажники и фаркопы":
        return "4-964";
      case "Инструменты":
        return "4-963";
      case "Прицепы":
        return "4-965";
      case "Автосигнализации":
        return "11-631";
      case "Иммобилайзеры":
        return "11-632";
      case "Механические блокираторы":
        return "11-633";
      case "Спутниковые системы":
        return "11-634";
      case "Тюнинг":
        return "22";
      case "Шины":
        return "10-048";
      case "Мотошины":
        return "10-047";
      case "Диски":
        return "10-046";
      case "Колёса":
        return "10-045";
      case "Колпаки":
        return "10-044";
      case "Экипировка":
        return "6-416";

      default:
        this.state.parseErrors.push(type);
    }
  };

  date = () => {
    const date = new Date();

    return `${date.getFullYear()}-${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }-${date.getDate()}d-${date.getHours()}h-${date.getMinutes()}m`;
  };

  componentDidMount() {
    this.changeContacts(this.state.city);
  }

  render() {
    const {
      isLoaded,
      data,
      vendorCodeIndex,
      titleIndex,
      OemIndex,
      manufacturerIndex,
      priceIndex,
      groupIndex,
      managerName,
      phone,
      address,
      parseErrors,
    } = this.state;

    const xmlData = () => {
      if (data.length > 0 && isLoaded) {
        // удаляем первый элемент, там заголовки столбцов
        data.splice(0, 1);
        const ads = data.map((item) => {
          const price =
            item[priceIndex] !== null
              ? Number(
                  String(item[priceIndex]).split(",")[0].replace(/\D/g, "")
                )
              : null;

          if (item.length < 1) return;

          const yearRegexp =
            /\b\d{4}-\d{4}\b|\b\d{4}-$|\b\d{4}- |\b20\d{2}\b|\b199\d\b/;
          const OemRegexp = /[^a-zA-Z0-9]/g;
          let addTitle = item[titleIndex];

          // если находим в названии год производства, то вырезаем его для заголовка
          if (yearRegexp.test(item[titleIndex])) {
            addTitle = item[titleIndex]
              .substring(0, item[titleIndex].search(yearRegexp))
              .trim();
          }

          // находим запрещенные символы и меняем их на дефис
          item[OemIndex] = String(item[OemIndex])
            .replace(OemRegexp, "-")
            .trim();

          // Готовое описание для Авито
          const description = () => {
            const detailWithSpecialDescription =
              item[groupIndex] === "Бампера" ||
              item[groupIndex] === "Автосвет" ||
              item[groupIndex] === "Радиаторы" ||
              item[groupIndex] === "Решетки радиатора" ||
              String(item[vendorCodeIndex]).startsWith("ST");

            if (detailWithSpecialDescription) {
              return `<Description>
                  <![CDATA[
                    <h3>${item[titleIndex]}</h3>
                    <ul>
                      <li>Производитель: ${item[manufacturerIndex]}</li>
                      <li>Артикул: ${item[vendorCodeIndex]}</li>
                      <li>OEM: ${item[OemIndex]}</li>
                      <li>Мы открыты для вас в будние дни с ${
                        this.state.city === "SPB"
                          ? "10:00 до 18:00"
                          : "08:00 до 17:00"
                      }</li>
                      <li>Это НОВАЯ деталь</li>
                      <li>Большой выбор других запчастей на этот и аналогичные автомобили</li>
                      <li>Даём 14 дней на примерку и установку</li>
                      <li>Качественный аналог</li>
                      <li>
                          ${
                            this.state.city === "SPB"
                              ? "Возможен самовывоз, либо доставка с оплатой курьеру при получении"
                              : "Самовывоз из Одинцово"
                          }
                      </li>
                      <li>Работаем с транспортными компаниями</li>
                      <li>Работаем по наличному и безналичному расчету</li>
                      <li>Продаем оптом и в розницу, приглашаем к сотрудничеству всех заинтересованных лиц, СТО, таксопарки, магазины и т.д </li>
                    </ul>   
                  ]]>
                </Description>`;
            }
            // всё остальное
            return `<Description>
                <![CDATA[
                  <h3>${item[titleIndex]}</h3>
                  <ul>
                    <li>Производитель: ${item[manufacturerIndex]}</li>
                    <li>Артикул: ${item[vendorCodeIndex]}</li>
                    <li>OEM: ${item[OemIndex]}</li>
                    <li>Мы открыты для вас в будние дни с ${
                      this.state.city === "SPB"
                        ? "10:00 до 18:00"
                        : "08:00 до 17:00"
                    }
                    </li>
                    <li>Это НОВАЯ деталь</li>
                    <li>Большой выбор других запчастей на этот и аналогичные автомобили</li>
                    <li>Даём 14 дней на примерку и установку</li>
                    <li>Качественный аналог</li>
                    <li>Возможен самовывоз, либо доставка с оплатой при получении</li>
                    <li>Отправляем всеми транспортными компаниями</li>
                    <li>Работаем по наличному и безналичному расчету</li>
                    <li>Продаем оптом и в розницу, приглашаем к сотрудничеству всех заинтересованных лиц, СТО, таксопарки, магазины и т.д </li>
                  </ul>   
                ]]>
              </Description>`;
          };
          return `
            <Ad>
              <Id>${item[vendorCodeIndex]}</Id>
              <ManagerName>${managerName}</ManagerName>
              <ContactPhone>${phone}</ContactPhone>
              <Address>${address}</Address>
              <Category>Запчасти и аксессуары</Category>
              <TypeId>${this.typeId(item[groupIndex], item)}</TypeId>
              ${
                item[manufacturerIndex] === "JunCheng"
                  ? "<AdType>Товар от производителя</AdType>"
                  : "<AdType>Товар приобретен на продажу</AdType>"
              }
              <Title>${addTitle}</Title>
              ${
                this.state.paid
                  ? description()
                  : `<Description>
                    ${item[titleIndex]}
                    Производитель: ${item[manufacturerIndex]}
                    Артикул: ${item[vendorCodeIndex]} OEM: ${item[OemIndex]}
                    ${
                      this.state.city === "SPB"
                        ? "Доставка по Санкт-Петербургу 500 рублей."
                        : "Самовывоз из Одинцово."
                    }
                    Доставка по всей России.
                  </Description>`
              }
              ${price && `<Price>${price}</Price>`}
              <Images>
                ${
                  /D$|DM$|D\d$/.test(item[vendorCodeIndex])
                    ? `<Image url="http://www.starttrade.compsit.ru/images/photo/st/${item[vendorCodeIndex]}.jpg" />`
                    : `<Image url="http://www.starttrade.compsit.ru/images/photo/st/${item[vendorCodeIndex]}.jpg" />`
                }
              </Images>
              <Condition>Новое</Condition>
              <OEM>${item[OemIndex]}</OEM>
            </Ad>
          `;
        });
        return `<Ads formatVersion="3" target="Avito.ru">${ads.join(
          " "
        )}</Ads>`;
      }
    };

    return data.length > 0 && isLoaded ? (
      <div className="finish">
        {this.generateXml(xmlData(), `avito-${this.date()}.xml`)}
        Скачайте файл, вы великолепны! =)
        <div style={{ marginTop: 30 }}>
          <button
            onClick={() => window.location.reload(false)}
            className="repeat"
          >
            Повторить
          </button>
        </div>
        {parseErrors.length > 0 && (
          <ol style={{ marginTop: 20 }}>
            {parseErrors.map((item, i) => {
              return (
                <li key={i}>
                  <span role="img" aria-label="Warning">
                    ⚠️
                  </span>{" "}
                  Типу "{item}" не найдено соответствий!
                </li>
              );
            })}
          </ol>
        )}
      </div>
    ) : (
      <section className="body">
        <div style={{ marginTop: 10 }}>
          Город: {this.state.city === "SPB" ? "Санкт-Петербург" : "Москва"}
        </div>
        <div className="city-buttons">
          <button
            onClick={() => this.changeCity("SPB")}
            className={`city-button ${this.state.city === "SPB" && "active"}`}
          >
            Санкт-Петербург
          </button>
          <button
            onClick={() => this.changeCity("MSK")}
            className={`city-button ${this.state.city === "MSK" && "active"}`}
          >
            Москва
          </button>
        </div>

        <DataInput loading={this.loading} />

        <div className="fields">
          <div className="row">
            <label htmlFor="manager-name">Имя менеджера: </label>
            <input
              type="text"
              value={managerName}
              onChange={this.changeManagerName}
              id="manager-name"
              maxLength={40}
            />
            <div>
              Имя менеджера, контактного лица компании по данному объявлению —
              строка не более 40 символов.
              <a
                href="https://autoload.avito.ru/format/zapchasti_i_aksessuary/#ManagerName"
                target="_blank"
                rel="noopener noreferrer"
              >
                документация
              </a>
            </div>
          </div>

          <div className="row">
            <label htmlFor="phone">Контактый телефон: </label>
            <input
              type="tel"
              value={phone}
              onChange={this.changePhone}
              id="phone"
            />
            <div>
              Контактный телефон — строка, содержащая только один российский
              номер телефона; должен быть обязательно указан код города или
              мобильного оператора. Корректные примеры: «+7 (495) 777-10-66»,
              «(81374) 4-55-75», «8 905 207 04 90», «+7 905 2070490»,
              «88123855085», «9052070490».
              <a
                href="https://autoload.avito.ru/format/zapchasti_i_aksessuary/#ContactPhone"
                target="_blank"
                rel="noopener noreferrer"
              >
                документация
              </a>
            </div>
          </div>

          <div className="row">
            <label htmlFor="address">Адрес: </label>
            <input
              type="text"
              value={address}
              onChange={this.changeAddress}
              id="address"
              maxLength={256}
            />
            <div>
              Полный адрес объекта — строка до 256 символов. Является
              альтернативой элементов "Region", "City", "Subway", "District" —
              при заполнении "Address", значения перечисленных элементов
              указывать не нужно, они будут проигнорированы. Примечание: Улица и
              номер дома не будут показаны в объявлении
              <a
                href="https://autoload.avito.ru/format/zapchasti_i_aksessuary/#Address"
                target="_blank"
                rel="noopener noreferrer"
              >
                документация
              </a>
            </div>
          </div>

          <div className="row">
            <div className="subtitle">Активная подписка на Авито:</div>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
            >
              <input
                type="checkbox"
                id="paid"
                checked={this.state.paid}
                onChange={this.changePaid}
              />
              <label htmlFor="paid" className="paid-label">
                Оплачено
              </label>
            </div>
            <div>
              <a
                href="https://support.avito.ru/articles/226597708"
                target="_blank"
                rel="noopener noreferrer"
              >
                документация
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

class DataInput extends React.Component {
  state = {
    hide: false,
  };

  handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      this.setState({ hide: true });
      this.props.loading(files[0]);
    }
  };

  render() {
    return this.state.hide ? null : (
      <form>
        <label htmlFor="file" className="select-button">
          Выбрать таблицу
          <input
            type="file"
            id="file"
            accept={SheetJSFT}
            onChange={this.handleChange}
            className="hidden"
          />
        </label>
      </form>
    );
  }
}

const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm",
]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

export default Avito;
