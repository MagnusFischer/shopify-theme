/* eslint-disable */
class CountryProvinceSelector {
  private readonly countryEl: HTMLSelectElement;

  private readonly provinceEl: HTMLSelectElement;

  private readonly provinceContainer: HTMLElement;

  constructor(country_domid: string, province_domid: string, options: { hideElement: string }) {
    this.countryEl = document.getElementById(country_domid) as HTMLSelectElement;
    this.provinceEl = document.getElementById(province_domid) as HTMLSelectElement;
    this.provinceContainer = document.getElementById(options.hideElement || province_domid);

    this.countryEl.addEventListener('change', () => this.countryHandler());

    this.initCountry();
    this.initProvince();
  }

  initCountry() {
    const value = this.countryEl.getAttribute('data-default');
    this.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  }

  initProvince() {
    const value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      this.setSelectorByValue(this.provinceEl, value);
    }
  }

  countryHandler() {
    let opt = this.countryEl.options[this.countryEl.selectedIndex];
    const raw = opt.getAttribute('data-provinces');
    const provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (let i = 0; i < provinces.length; i++) {
        opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = '';
    }
  }

  clearOptions(selector: HTMLSelectElement) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }

  setSelectorByValue(selector: HTMLSelectElement, value: string) {
    for (let i = 0, count = selector.options.length; i < count; i++) {
      const option = selector.options[i];
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
  }
}

export default (country_domid: string, province_domid: string, options: { hideElement: string }) =>
  new CountryProvinceSelector(country_domid, province_domid, options);
