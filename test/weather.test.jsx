import {describe, test, vi, it, expect, beforeEach, afterEach} from 'vitest';
import {JSDOM} from 'jsdom';

global.document = new JSDOM().window.document;

const mockDOM = {
    searchInput: {value: '', addEventListener: vi.fn()},
    searchButton: {addEventListener: vi.fn()},
    errorDiv: {style: {display: 'none'}},
    weatherIcon: {src: ''},
    tempElement: {textContent: ''},
    cityElement: {textContent: ''},
    humidityElement: {textContent: ''},
    windElement: {textContent: ''}
}

global.fetch = vi.fn(); 

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn()
}

document.querySelector = vi.fn((selector) => {
    switch(selector) {
        case '.search input':
        return mockDOM.searchInput;

        case '.search button':
        return mockDOM.searchButton;

        case '.error':
        return mockDOM.errorDiv;

        case '.weather-icon':
        return mockDOM.weatherIcon;

        case '.temp':
        return mockDOM.tempElement;

        case '.city':
        return mockDOM.cityElement;

        case '.humidity':
        return mockDOM.humidityElement;

        case '.wind':
        return mockDOM.windElement;

        default:
        return null;
    }
})

describe('Weather App', () => { 
    beforeEach(() => {
        //Retest all the mocks before each test
        vi.clearAllMocks();
        mockDOM.searchInput.value = '';
        mockDOM.searchButton.value = '';
        mockDOM.errorDiv.style.display = 'none';
        mockDOM.weatherIcon.src = '';
        mockDOM.tempElement.textContent = '';
        mockDOM.cityElement.textContent = '';
        mockDOM.humidityElement.textContent = '';
        mockDOM.windElement.textContent = '';
    });

describe('fetchWeather', () => {
    it('should fetch weather data successfully', async () => {
        //Arrange: Setup the test environment
        const mockData = {
            name: 'Edmonton',
            main: {
                temp: 20,
                humidity: 50
            },
            weather: [{
                icon: '01d'
            }],
            wind: [{
                speed: 10
            }]
        };

    //call fetchWeather
    await fetchWeather('Edmonton');    

    //verify API call
    expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('Edmonton') &&
        expect.stringContaining('198cd181fab995f05b0d705991165dba')
    );

    //verify DOM updates
    expect(mockDOM.weatherIcon.src).toContain('01d');
    expect(mockDOM.tempElement.textContent).toBe('20°C');
    expect(mockDOM.cityElement.textContent).toBe('Edmonton');
    expect(mockDOM.humidityElement.textContent).toBe('50%');
    expect(mockDOM.windElement.textContent).toBe('10 km/h');
    });

    it('should handle API errors correctly', async () => {
        // Mock failed API response
        global.fetch.mockRejectedValueOnce(new Error('City not found'));

        // Call fetchWeather
        await fetchWeather('InvalidCity');

        // Verify error handling
        expect(mockDOM.errorDiv.style.display).toBe('block');
    });
});

describe('Event Listeners', () => {
    it('should trigger search on button click', () => {
        // Simulate button click
        const clickEvent = new Event('click');
        mockDOM.searchButton.addEventListener.mock.calls[0][1](clickEvent);

        // Verify event listener was added
        expect(mockDOM.searchButton.addEventListener).toHaveBeenCalledWith(
            'click',
            expect.any(Function)
        );
    });

        // Verify event listener was added
        expect(mockDOM.searchInput.addEventListener).toHaveBeenCalledWith(
            'keypress',
            expect.any(Function)
        );
    });

})
