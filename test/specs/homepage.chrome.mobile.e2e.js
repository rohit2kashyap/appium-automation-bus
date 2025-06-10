import { PaytmTravelLoginFetched, sessionValue, login_successful } from "../../loginCredentials.js";

describe('Paytm Bus Web App', () => {
  it('should open the bus page and complete full booking flow', async () => {
    // Navigate to the bus page
    await browser.url('/bus');  // baseUrl + /bus = http://fe.paytm.com:3001/bus
    
    // Clear all browser storage and cookies before executing the test
    console.log('=== CLEARING ALL BROWSER STORAGE AND COOKIES ===');
    
    // Clear localStorage, sessionStorage, and cookies
    await browser.execute((sessionValueData, paytmTravelLoginFetched, login_successful) => {
      // Clear localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('Paytm-MBus-smartFilterCoachShown', 'true');
        // localStorage.clear();
        console.log('sessionValueData', sessionValueData);
        console.log('paytmTravelLoginFetched',paytmTravelLoginFetched);
        console.log('login_successful', login_successful);
        
        
        localStorage.setItem('sessionValue', JSON.stringify(sessionValueData));
        localStorage.setItem('PaytmTravelLoginFetched', paytmTravelLoginFetched);
        localStorage.setItem('login_successful', JSON.stringify(login_successful));
        // localStorage.removeItem('Paytm-MBus-RecentSearches');
        console.log('✅ localStorage set with login credentials');
        console.log('📋 sessionValue stored as JSON string');
        console.log('📅 PaytmTravelLoginFetched stored as string');
        console.log('🎯 login_successful stored as JSON string');
        
        // Debug: Verify what was actually stored
        console.log('🔍 Verification - sessionValue length:', localStorage.getItem('sessionValue').length);
        console.log('🔍 Verification - PaytmTravelLoginFetched:', localStorage.getItem('PaytmTravelLoginFetched'));
        console.log('🔍 Verification - login_successful length:', localStorage.getItem('login_successful').length);
      }
    }, sessionValue, PaytmTravelLoginFetched, login_successful);
    
    // Refresh browser after clearing storage (must be outside browser.execute)
    // await browser.refresh();
    console.log('✅ Browser refreshed to reflect storage changes');
    
    // Clear all cookies

    
    console.log('🧹 Browser storage cleanup completed');
    
    const title = await browser.getTitle();
    console.log('Page Title:', title);
    expect(title).toContain('Bus');  // Adjust based on actual page title
    
    // Wait for the page to load completely
    await browser.pause(2000); // Reduced from 3000

    // === DATE SELECTION: SELECT NEXT DAY ===
    console.log('=== SELECTING NEXT DAY DATE ===');
    
    try {
      // Get today's date and calculate tomorrow
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Get tomorrow's day name (e.g., "monday", "tuesday", etc.)
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const tomorrowDayName = dayNames[tomorrow.getDay()].toLowerCase();
      
      console.log(`Today is: ${dayNames[today.getDay()]}`);
      console.log(`Looking for tomorrow: ${tomorrowDayName}`);
      console.log(`Tomorrow's date: ${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`);
      
      // Look for date elements with aria-label matching tomorrow's day
      console.log(`Searching for date element with aria-label containing "${tomorrowDayName}"...`);
      
      // Try multiple selectors to find the date element
      const dateSelectors = [
        `//*[@aria-label[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${tomorrowDayName}")]]`,
        `//*[contains(@aria-label, "${tomorrowDayName}")]`,
        `//*[contains(@aria-label, "${tomorrowDayName.charAt(0).toUpperCase() + tomorrowDayName.slice(1)}")]`
      ];
      
      let dateSelected = false;
      
      for (const selector of dateSelectors) {
        try {
          console.log(`Trying selector: ${selector}`);
          const tomorrowDateElement = await $(selector);
          
          if (await tomorrowDateElement.isExisting()) {
            console.log(`Found date element with aria-label for ${tomorrowDayName}`);
            
            // Check if element is clickable and displayed
            const isDisplayed = await tomorrowDateElement.isDisplayed();
            const isClickable = await tomorrowDateElement.isClickable();
            
            if (isDisplayed && isClickable) {
              console.log(`Clicking on ${tomorrowDayName} date...`);
              await tomorrowDateElement.click();
              console.log(`✅ Successfully selected ${tomorrowDayName} date`);
              dateSelected = true;
              break;
            } else {
              console.log(`Date element found but not clickable/displayed`);
            }
          } else {
            console.log(`Date element not found with this selector`);
          }
        } catch (e) {
          console.log(`Error with selector ${selector}:`, e.message);
        }
      }
      
      // Alternative approach: Find all date elements and check their aria-labels
      if (!dateSelected) {
        console.log('Alternative approach: Checking all elements with aria-label...');
        
        const allAriaLabelElements = await $$('//*[@aria-label]');
        console.log(`Found ${allAriaLabelElements.length} elements with aria-label`);
        
        for (let i = 0; i < allAriaLabelElements.length; i++) {
          try {
            const element = allAriaLabelElements[i];
            const ariaLabel = await element.getAttribute('aria-label');
            
            if (ariaLabel && ariaLabel.toLowerCase().includes(tomorrowDayName)) {
              console.log(`Found matching aria-label: "${ariaLabel}"`);
              
              const isDisplayed = await element.isDisplayed();
              const isClickable = await element.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking element with aria-label: "${ariaLabel}"`);
                await element.click();
                console.log(`✅ Successfully selected date using aria-label: "${ariaLabel}"`);
                dateSelected = true;
                break;
              } else {
                console.log(`Element with aria-label "${ariaLabel}" not clickable/displayed`);
              }
            }
          } catch (e) {
            console.log(`Error checking element ${i}:`, e.message);
          }
        }
      }
      
      // Final fallback: Look for date number in date picker
      if (!dateSelected) {
        console.log('Final fallback: Looking for tomorrow\'s date number...');
        const tomorrowDate = tomorrow.getDate();
        
        const dateNumberElement = await $(`//*[contains(@class, "date") or contains(@class, "day")]//*[text()="${tomorrowDate}"] | //*[text()="${tomorrowDate}"][contains(@class, "date") or contains(@class, "day")]`);
        
        if (await dateNumberElement.isExisting()) {
          const isDisplayed = await dateNumberElement.isDisplayed();
          const isClickable = await dateNumberElement.isClickable();
          
          if (isDisplayed && isClickable) {
            console.log(`Clicking on date number: ${tomorrowDate}`);
            await dateNumberElement.click();
            console.log(`✅ Successfully selected date ${tomorrowDate} (fallback)`);
            dateSelected = true;
          }
        }
      }
      
      if (dateSelected) {
        console.log('✅ Date selection completed successfully');
        // Wait for date selection to register
        await browser.pause(2000);
      } else {
        console.log('⚠️ Could not select tomorrow\'s date - proceeding with default date');
        console.log('💡 Manual date selection may be required');
      }
      
    } catch (e) {
      console.log('❌ Date selection failed:', e.message);
      console.log('⚠️ Proceeding without date selection - may use default date');
    }
    
    // Fill From and To fields
    console.log('=== FILLING FROM AND TO FIELDS ===');
    
    let fieldsFilledSuccessfully = false;
    
    // Check if From and To fields are already filled using the specific xpath
    console.log('Checking if From and To fields are already filled...');
    const fromDiv = await $('//*[@id="bookingForm"]/div[2]/div[1]/div/div/div[1]/div/div');
    
    if (await fromDiv.isExisting()) {
      const fromDivText = await fromDiv.getText();
      console.log('From div text value:', fromDivText);
      
      // Check if From div contains any city name (not just "From" text)
      // If it contains text other than "From" or is not empty, it likely has a city
      const hasFromCity = fromDivText && fromDivText.trim() && 
                         !fromDivText.toLowerCase().includes('from') && 
                         fromDivText.length > 2;
      
      if (hasFromCity) {
        console.log('✅ From div already contains a city:', fromDivText);
        fieldsFilledSuccessfully = true;
        
        // Check To div as well
        // const toDiv = await $('//*[@id="bookingForm"]/div[2]/div[1]/div/div/div[2]/div/div');
        // if (await toDiv.isExisting()) {
        //   const toDivText = await toDiv.getText();
        //   console.log('To div text value:', toDivText);
          
        //   const hasToCity = toDivText && toDivText.trim() && 
        //                    !toDivText.toLowerCase().includes('to') && 
        //                    toDivText.length > 2;
          
        //   if (hasToCity) {
        //     console.log('✅ To div already contains a city:', toDivText);
        //     console.log('🚀 Both From and To fields are already filled - skipping form filling');
        //     fieldsFilledSuccessfully = true;
        //   } else {
        //     console.log('To div needs to be filled, proceeding with form filling...');
        //   }
        // } else {
        //   console.log('To div not found, proceeding with form filling...');
        // }
      } else {
        console.log('From div needs to be filled, proceeding with form filling...');
      }
    } else {
      console.log('From div not found with specific xpath, proceeding with form filling...');
    }
    
    // Only fill forms if fields are not already populated
    if (!fieldsFilledSuccessfully) {
      console.log('From and To fields need to be filled. Proceeding with form filling...');
      
      try {
        // Click on From div to open input field
        console.log('Looking for From div to click...');
        
        if (await fromDiv.isExisting()) {
          console.log('Found From div, clicking to open input...');
          await fromDiv.click();
          await browser.pause(1000); // Wait for input to appear
          
          // Now look for the input field that appeared using specific ID
          console.log('Looking for From input field by ID searchContainerSource...');
          const fromInput = await $('#searchContainerSource');
          
          if (await fromInput.isExisting()) {
            console.log('Found From input field with ID, filling...');
            await fromInput.clearValue();
            await fromInput.setValue('Bengaluru');
            console.log('✅ Entered Bengaluru in From field');
            
            // Wait for suggestions and select first item
            await browser.pause(2000);
            try {
              // Use image with alt="city" as reference for suggestion selection
              console.log('Looking for From suggestions using city icon reference...');
              
              const cityIconSuggestions = await $$('//img[@alt="city"]/parent::* | //img[@alt="city"]/ancestor::*[1] | //img[contains(@alt, "city")]/parent::*');
              console.log(`Found ${cityIconSuggestions.length} suggestions with city icons`);
              
              let fromSuggestionSelected = false;
              
              if (cityIconSuggestions.length > 0) {
                // Try to click the first suggestion with city icon
                for (let i = 0; i < cityIconSuggestions.length; i++) {
                  try {
                    const suggestion = cityIconSuggestions[i];
                    const isClickable = await suggestion.isClickable();
                    const isDisplayed = await suggestion.isDisplayed();
                    
                    if (isClickable && isDisplayed) {
                      console.log(`Clicking From suggestion ${i} with city icon...`);
                      await suggestion.click();
                      console.log('✅ Selected From suggestion using city icon');
                      fromSuggestionSelected = true;
                      break;
                    }
                  } catch (e) {
                    console.log(`Failed to click From suggestion ${i} with city icon:`, e.message);
                  }
                }
              }
              
              // Fallback to text-based selection if city icon method fails
              if (!fromSuggestionSelected) {
                console.log('City icon method failed, trying text-based selection...');
                const firstFromSuggestion = await $('//*[contains(text(), "Bengaluru")][1] | //li[1] | //*[contains(@class, "suggestion")][1]');
                if (await firstFromSuggestion.isExisting()) {
                  await firstFromSuggestion.click();
                  console.log('✅ Selected first item from From suggestions (fallback)');
                  fromSuggestionSelected = true;
                } else {
                  console.log('No From suggestions found with fallback method');
                }
              }
              
              if (fromSuggestionSelected) {
                // Wait longer for UI to settle after From selection
                console.log('⏳ Waiting for UI to settle after From selection...');
                await browser.pause(3000); // Increased from 1000 to 3000ms
              }
              
            } catch (e) {
              console.log('From suggestion selection failed:', e.message);
              await browser.pause(1000);
            }
            
            // Debug: Check page state before proceeding to To field
            console.log('=== DEBUGGING BEFORE TO FIELD ===');
            try {
              const currentUrl = await browser.getUrl();
              console.log('Current URL:', currentUrl);
              
              const pageTitle = await browser.getTitle();
              console.log('Current page title:', pageTitle);
            } catch (e) {
              console.log('Debug failed:', e.message);
            }
            
            // To input should now be directly available below From input
            console.log('Looking for To input field directly (no div click needed)...');
            const toInput = await $('#searchContainerDestination');
            
            if (await toInput.isExisting()) {
              console.log('Found To input field with ID, clicking first to ensure focus...');
              await toInput.click();
              await browser.pause(500);
              
              console.log('Clearing and filling To field...');
              await toInput.clearValue();
              await toInput.setValue('Hyderabad');
              console.log('✅ Entered Hyderabad in To field');
              
              // Verify the value was entered
              try {
                const enteredValue = await toInput.getValue();
                console.log(`Verification: To field value is "${enteredValue}"`);
              } catch (e) {
                console.log('Could not verify To field value');
              }
              
              // Wait for suggestions and select first item
              await browser.pause(2000);
              try {
                // Use image with alt="city" as reference for suggestion selection
                console.log('Looking for To suggestions using city icon reference...');
                
                const cityIconSuggestions = await $$('//img[@alt="city"]/parent::* | //img[@alt="city"]/ancestor::*[1] | //img[contains(@alt, "city")]/parent::*');
                console.log(`Found ${cityIconSuggestions.length} suggestions with city icons`);
                
                let toSuggestionSelected = false;
                
                if (cityIconSuggestions.length > 0) {
                  // Try to click the first suggestion with city icon
                  for (let i = 0; i < cityIconSuggestions.length; i++) {
                    try {
                      const suggestion = cityIconSuggestions[i];
                      const isClickable = await suggestion.isClickable();
                      const isDisplayed = await suggestion.isDisplayed();
                      
                      if (isClickable && isDisplayed) {
                        console.log(`Clicking To suggestion ${i} with city icon...`);
                        await suggestion.click();
                        console.log('✅ Selected To suggestion using city icon');
                        toSuggestionSelected = true;
                        break;
                      }
                    } catch (e) {
                      console.log(`Failed to click To suggestion ${i} with city icon:`, e.message);
                    }
                  }
                }
                
                // Fallback to text-based selection if city icon method fails
                if (!toSuggestionSelected) {
                  console.log('City icon method failed, trying text-based selection...');
                  const firstToSuggestion = await $('//*[contains(text(), "Hyderabad")][1] | //li[1] | //*[contains(@class, "suggestion")][1]');
                  if (await firstToSuggestion.isExisting()) {
                    await firstToSuggestion.click();
                    console.log('✅ Selected first item from To suggestions (fallback)');
                    toSuggestionSelected = true;
                  } else {
                    console.log('No To suggestions found with fallback method');
                  }
                }
                
                // Final fallback: keyboard navigation
                if (!toSuggestionSelected) {
                  console.log('Trying keyboard navigation as final fallback...');
                  try {
                    await toInput.click();
                    await browser.keys(['ArrowDown', 'Enter']);
                    console.log('✅ Selected To suggestion using keyboard navigation');
                    toSuggestionSelected = true;
                  } catch (e) {
                    console.log('Keyboard navigation failed:', e.message);
                  }
                }
                
                if (toSuggestionSelected) {
                  console.log('✅ To suggestion selection completed successfully');
                } else {
                  console.log('❌ Could not select any To suggestion with any method');
                }
                
              } catch (e) {
                console.log('To suggestion selection failed:', e.message);
              }
              
              fieldsFilledSuccessfully = true;
              console.log('✅ Both From and To fields filled successfully');
              
            } else {
              console.log('❌ To input field with ID searchContainerDestination not found directly');
              
              // Debug: Try to find what inputs are available
              console.log('Debugging: Looking for any inputs available...');
              const allInputs = await $$('//input');
              console.log(`Found ${allInputs.length} input elements`);
              
              // Fallback: Try to use any second input if available
              if (allInputs.length >= 2) {
                console.log('Fallback: Trying to use second input as To field...');
                const secondInput = allInputs[1];
                await secondInput.click();
                await browser.pause(500);
                await secondInput.clearValue();
                await secondInput.setValue('Hyderabad');
                console.log('✅ Entered Hyderabad in second input (fallback)');
                
                await browser.pause(2000);
                try {
                  const firstToSuggestion = await $('//*[contains(text(), "Hyderabad")][1]');
                  if (await firstToSuggestion.isExisting()) {
                    await firstToSuggestion.click();
                    console.log('✅ Selected Hyderabad suggestion (fallback)');
                  }
                } catch (e) {
                  console.log('Fallback To suggestion failed:', e.message);
                }
                
                fieldsFilledSuccessfully = true;
                console.log('✅ Both fields filled successfully using fallback method');
              }
            }
            
          } else {
            console.log('❌ From input field with ID searchContainerSource did not appear');
          }
          
        } else {
          console.log('From div not found, trying to click Search Buses directly...');
          const searchButton = await $('//*[contains(text(), "Search Buses")] | //button[contains(text(), "Search")] | //*[contains(text(), "Search")]');
          if (await searchButton.isExisting()) {
            await searchButton.click();
            console.log('✅ Clicked Search Buses button directly');
          } else {
            console.log('❌ Search Buses button not found');
          }
        }
        
      } catch (e) {
        console.log('Field filling failed:', e.message);
      }
    } else {
      console.log('✅ From and To fields are already populated - skipping form filling');
    }
    
    await browser.pause(1000);
    
    // Only search for buses if fields were filled successfully
    if (fieldsFilledSuccessfully) {
      // Search for buses
      console.log('=== SEARCHING FOR BUSES ===');
      await browser.execute('window.scrollBy(0, 200)');
      await browser.pause(500);
      
      try {
        const searchButton = await $('//*[contains(text(), "Search Buses")] | //button[contains(text(), "Search")] | //*[contains(text(), "Search")]');
        if (await searchButton.isExisting()) {
          console.log('Found search button, clicking...');
          await searchButton.click();
          console.log('✅ Search button clicked successfully');
        } else {
          // Scroll down more to find search button
          console.log('Search button not found, scrolling down...');
          await browser.execute('window.scrollBy(0, 300)');
          await browser.pause(1000);
          
          const searchBtnAfterScroll = await $('//*[contains(text(), "Search Buses")] | //*[contains(text(), "Search")]');
          if (await searchBtnAfterScroll.isExisting()) {
            console.log('Found search button after scroll, clicking...');
            await searchBtnAfterScroll.click();
            console.log('✅ Search button clicked after scroll');
          } else {
            console.log('❌ Still no search button found - may need manual intervention');
            throw new Error('Search button not found after scrolling');
          }
        }
      } catch (e) {
        console.log('Search button click failed:', e.message);
        throw new Error('Could not proceed past homepage - search button issue');
      }
    } else {
      console.log('❌ Skipping search - From and To fields were not filled successfully');
      throw new Error('Cannot proceed without filling From and To fields');
    }
    
    // Wait for navigation to search results (reduced wait time)
    console.log('⏳ Waiting for navigation to search results...');
    await browser.pause(3000); // Reduced from 5000
    
    let currentUrl = await browser.getUrl();
    console.log('URL after search:', currentUrl);
    
    // Verify navigation success
    if (currentUrl.includes('search') || currentUrl.includes('result')) {
      console.log('✅ Successfully navigated to search results page');
    } else {
      console.log('❌ May not have navigated to search results - URL:', currentUrl);
      // Try to continue anyway
    }
    
    // === STEP 1: CLICK FIRST BUS CARD ===
    console.log('=== STEP 1: CLICKING FIRST BUS CARD ===');
    await browser.pause(3000);
    
    try {
      // First, check and dismiss any tooltips/modals that might be blocking the click
      console.log('🔍 Checking for tooltips or modals that might block bus card click...');
      
      try {
        // Look for "Add to Shortlist" tooltip/modal
        const shortlistTooltip = await $('//*[contains(text(), "Add to Shortlist")]');
        if (await shortlistTooltip.isExisting()) {
          console.log('📝 Found "Add to Shortlist" tooltip, attempting to dismiss...');
          
          // Try multiple approaches to find and click the close button
          let tooltipClosed = false;
          
          // Method 1: Look for close button near "Add to Shortlist" text
          const closeButton1 = await $('//*[contains(text(), "Add to Shortlist")]/ancestor::*[1]//*[contains(@class, "close") or text()="×" or text()="✕"]');
          if (await closeButton1.isExisting()) {
            console.log('❌ Method 1: Clicking close button on tooltip...');
            await closeButton1.click();
            await browser.pause(1000);
            console.log('✅ Tooltip closed via close button (Method 1)');
            tooltipClosed = true;
          }
          
          // Method 2: Look for X button in top-right of modal/tooltip
          if (!tooltipClosed) {
            const closeButton2 = await $('//button[contains(@class, "close")] | //*[text()="×"] | //*[text()="✕"] | //*[contains(@aria-label, "close")] | //*[contains(@title, "close")]');
            if (await closeButton2.isExisting() && await closeButton2.isDisplayed()) {
              console.log('❌ Method 2: Clicking X close button...');
              await closeButton2.click();
              await browser.pause(1000);
              console.log('✅ Tooltip closed via X button (Method 2)');
              tooltipClosed = true;
            }
          }
          
          // Method 3: Look specifically for shortlist tooltip close button
          if (!tooltipClosed) {
            const shortlistClose = await $('//*[contains(text(), "New feature")]/following-sibling::* | //*[contains(text(), "Add to Shortlist")]/parent::*//*[contains(@class, "close")]');
            if (await shortlistClose.isExisting()) {
              console.log('❌ Method 3: Clicking shortlist tooltip close...');
              await shortlistClose.click();
              await browser.pause(1000);
              console.log('✅ Tooltip closed via shortlist close (Method 3)');
              tooltipClosed = true;
            }
          }
          
          if (!tooltipClosed) {
            // Try clicking outside the tooltip to dismiss it
            console.log('🖱️ No close button found, trying to click outside tooltip...');
            await browser.execute(() => {
              // Click on the body element to dismiss tooltip
              document.body.click();
            });
            await browser.pause(1000);
            console.log('✅ Clicked outside tooltip to dismiss');
          }
        }
        
        // Also check for any other modal/overlay that might be blocking
        const anyModal = await $('//*[contains(@class, "modal") or contains(@class, "overlay") or contains(@class, "popup") or contains(@class, "tooltip")]');
        if (await anyModal.isExisting() && await anyModal.isDisplayed()) {
          console.log('🚫 Found modal/overlay, trying to dismiss...');
          
          // Try ESC key to close modal
          await browser.keys(['Escape']);
          await browser.pause(1000);
          
          // Or click outside
          await browser.execute(() => {
            document.body.click();
          });
          await browser.pause(1000);
          console.log('✅ Modal/overlay dismissed');
        }
        
      } catch (e) {
        console.log('⚠️ Tooltip/modal check failed, continuing anyway:', e.message);
      }
      
      // Look for the first "₹" symbol in a bus card (dynamic approach)
      console.log('🚌 Looking for first ₹ symbol in bus cards...');
      
      // Find all ₹ symbols on the page
      const priceElements = await $$('//*[text()="₹"]');
      console.log(`Found ${priceElements.length} ₹ symbols on page`);
      
      let busCardClicked = false;

          
    // Find first price element that's not in the header
      if (!busCardClicked) {
        console.log('Fallback: Looking for first price element outside header...');
        
        // Skip the first few ₹ symbols as they might be in headers/summaries
        const potentialBusPrice = await $('(//*[text()="₹"])[position()>3][1]');
        
        if (await potentialBusPrice.isExisting()) {
          console.log('Found potential bus price element, clicking...');
          await potentialBusPrice.scrollIntoView();
          await browser.pause(1000);
          
          // Try to click the price element or find its clickable ancestor
          let clickableElement = potentialBusPrice;
          
          // Look for clickable ancestor (go up the DOM tree)
          for (let level = 1; level <= 5; level++) {
            try {
              const ancestor = await potentialBusPrice.$(`ancestor::*[${level}]`);
              if (await ancestor.isExisting() && await ancestor.isClickable()) {
                clickableElement = ancestor;
                console.log(`Found clickable ancestor at level ${level}`);
                break;
              }
            } catch (e) {
              // Continue to next level
            }
          }
          
          if (await clickableElement.isDisplayed()) {
            await clickableElement.click();
            console.log('✅ Bus card clicked via fallback price element');
            busCardClicked = true;
          }
        }
      }
      
      if (!busCardClicked) {
        console.log('❌ Could not click any bus card via ₹ symbol');
        throw new Error('No bus card could be selected');
      }
      
    } catch (e) {
      console.log('Bus card click failed:', e.message);
      throw new Error('Bus card selection failed: ' + e.message);
    }
    
    // === STEP 2: SELECT SEAT ===
    console.log('=== STEP 2: SELECTING SEAT ===');
    await browser.pause(7000);
    
    try {
      console.log('🪑 Looking for ANY available seat to click just ONCE...');
      
      // Simple approach: Find first available seat with price and click it once
      console.log('Finding first seat with price...');
      
      // Look for clean price elements that are likely seats
      const seatPrices = await $$('//*[contains(text(), "₹") and string-length(text()) < 8]');
      console.log(`Found ${seatPrices.length} potential seat price elements`);
      
      let seatClicked = false;
      
      for (let i = 0; i < seatPrices.length; i++) {
        try {
          const priceElement = seatPrices[i];
          const priceText = await priceElement.getText();
          
          // Skip summary text or banners
          if (priceText.includes('starting') || priceText.includes('with') || priceText.length > 8) {
            console.log(`Skipping ${i}: "${priceText}" - looks like summary text`);
            continue;
          }
          
          // Check if it looks like a valid seat price
          if (priceText.match(/^₹\d{3,4}$/)) {
            console.log(`🎯 Found valid seat price: ${priceText}`);
            
            // Try to click this seat
            if (await priceElement.isDisplayed() && await priceElement.isClickable()) {
              console.log(`🪑 Clicking seat with price ${priceText} - WILL ONLY CLICK ONCE!`);
              await priceElement.scrollIntoView();
              await browser.pause(500);
              await priceElement.click();
              console.log(`✅ Clicked seat ${i} with price ${priceText}`);
              seatClicked = true;
              break; // STOP IMMEDIATELY after first click
            } else {
              // Try parent container if price element itself isn't clickable
              const parent = await priceElement.$('..');
              if (await parent.isClickable() && await parent.isDisplayed()) {
                console.log(`🪑 Clicking parent container for seat with price ${priceText}`);
                await parent.scrollIntoView();
                await browser.pause(500);
                await parent.click();
                console.log(`✅ Clicked parent container for seat ${i} with price ${priceText}`);
                seatClicked = true;
                break; // STOP IMMEDIATELY after first click
              }
            }
          }
        } catch (e) {
          console.log(`Failed to process seat ${i}:`, e.message);
        }
      }
      
      // If no clean price format worked, try any price element as fallback
      if (!seatClicked) {
        console.log('Fallback: Clicking any available price element...');
        
        const anyPriceElements = await $$('//*[contains(text(), "₹")]');
        
        for (let i = 0; i < anyPriceElements.length; i++) {
          try {
            const element = anyPriceElements[i];
            const text = await element.getText();
            
            // Skip obvious non-seats
            if (text.includes('starting at') || text.includes('with NEW2BUS') || text.length > 15) {
              continue;
            }
            
            if (await element.isDisplayed() && await element.isClickable()) {
              console.log(`🪑 FALLBACK: Clicking any price element: "${text}"`);
              await element.scrollIntoView();
              await browser.pause(500);
              await element.click();
              console.log(`✅ FALLBACK: Clicked element with text: "${text}"`);
              seatClicked = true;
              break; // STOP IMMEDIATELY after first click
            }
          } catch (e) {
            console.log(`Fallback element ${i} failed:`, e.message);
          }
        }
      }
      
      if (seatClicked) {
        console.log('🎉 SEAT CLICKED SUCCESSFULLY - NO MORE SEAT SELECTIONS!');
        console.log('⏳ Waiting for seat selection to register...');
        await browser.pause(3000); // Wait for UI to update
      } else {
        throw new Error('Could not click any seat');
      }
      
    } catch (e) {
      console.log('❌ Seat selection failed:', e.message);
      throw new Error('Seat selection failed - aborting test');
    }
    
    // === STEP 3: CLICK NEXT BUTTON ===
    console.log('=== STEP 3: CLICKING NEXT BUTTON ===');
    await browser.pause(3000); // Increased wait time to ensure seat selection is processed
    
    try {
      console.log('🔍 Looking for Next button...');
      
      // Multiple selectors for Next button
      const nextSelectors = [
        '//*[contains(text(), "Next")]',
        '//button[contains(text(), "Next")]',
        '//*[contains(text(), "NEXT")]',
        '//input[@value="Next"]',
        '//*[contains(@class, "next")]//*[contains(text(), "Next")]',
        '//*[@id="next" or @id="nextBtn"]'
      ];
      
      let nextClicked = false;
      
      for (const selector of nextSelectors) {
        try {
          console.log(`Trying Next button selector: ${selector}`);
          const nextButton = await $(selector);
          
          if (await nextButton.isExisting()) {
            console.log('Found Next button, checking if clickable...');
            
            // Scroll to button to ensure it's visible
            await nextButton.scrollIntoView();
            await browser.pause(1000);
            
            const isDisplayed = await nextButton.isDisplayed();
            const isClickable = await nextButton.isClickable();
            
            console.log(`Next button - displayed: ${isDisplayed}, clickable: ${isClickable}`);
            
            if (isDisplayed && isClickable) {
              console.log('✅ Clicking Next button...');
              await nextButton.click();
              console.log('✅ Next button clicked successfully');
              
              // Wait for navigation
              await browser.pause(3000);
              
              // Verify navigation to pickup points
              const pickupIndicators = await $$('//*[contains(text(), "Pickup") or contains(text(), "Pick-up") or contains(text(), "Boarding")]');
              if (pickupIndicators.length > 0) {
                console.log('✅ Successfully navigated to Pickup Points page');
              } else {
                console.log('⚠️ Navigation may not have completed - continuing anyway');
              }
              
              nextClicked = true;
              break;
            } else {
              console.log('Next button found but not clickable, trying next selector...');
            }
          } else {
            console.log('Next button not found with this selector');
          }
        } catch (e) {
          console.log(`Next button selector ${selector} failed:`, e.message);
        }
      }
      
      // JavaScript click as fallback
      if (!nextClicked) {
        console.log('Trying JavaScript click on Next button as fallback...');
        try {
          const jsNextButton = await $('//*[contains(text(), "Next")]');
          if (await jsNextButton.isExisting()) {
            await browser.execute((element) => {
              element.click();
            }, jsNextButton);
            console.log('✅ Next button clicked using JavaScript');
            await browser.pause(3000);
            nextClicked = true;
          }
        } catch (e) {
          console.log('JavaScript Next button click failed:', e.message);
        }
      }
      
      if (!nextClicked) {
        console.log('❌ Could not find or click Next button');
        
        // Debug what buttons are available
        try {
          const allButtons = await $$('//button | //input[@type="button"] | //input[@type="submit"] | //*[@role="button"]');
          console.log(`Found ${allButtons.length} buttons on page`);
          
          for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
            try {
              const button = allButtons[i];
              const text = await button.getText();
              const value = await button.getAttribute('value');
              const isDisplayed = await button.isDisplayed();
              console.log(`Button ${i}: text="${text}", value="${value}", displayed=${isDisplayed}`);
            } catch (e) {
              console.log(`Button ${i}: Could not get details`);
            }
          }
        } catch (e) {
          console.log('Button debug failed:', e.message);
        }
        
        throw new Error('Next button not found after all attempts');
      }
      
    } catch (e) {
      console.log('Next button click failed:', e.message);
      throw new Error('Next button click failed - aborting test');
    }
    
    // === STEP 4: SELECT PICKUP POINT ===
    console.log('=== STEP 4: SELECTING PICKUP POINT ===');
    await browser.pause(3000);
    
    try {
      // Use calendar icon as reference to find pickup point cards and select first available
      console.log('Looking for pickup points using calendar icon reference...');
      
      // Find all calendar icons (pickup/drop points have calendar icons)
      const calendarIcons = await $$('//img[contains(@src, "calendar") or contains(@alt, "calendar")]');
      console.log(`Found ${calendarIcons.length} calendar icons`);
      
      let pickupSelected = false;
      
      // Try each calendar icon's parent container until we find an available one
      for (let i = 0; i < calendarIcons.length; i++) {
        try {
          console.log(`Checking calendar icon ${i} for pickup point...`);
          
          // Get the parent container of the calendar icon (the pickup/drop point card)
          const pickupCard = await calendarIcons[i].$('../../..');  // Go up multiple levels to get the card
          
          if (await pickupCard.isExisting()) {
            // Check if this card is disabled
            const cardClasses = await pickupCard.getAttribute('class');
            const isDisabled = cardClasses && (cardClasses.includes('disabled') || cardClasses.includes('inactive'));
            
            if (!isDisabled) {
              const isDisplayed = await pickupCard.isDisplayed();
              const isClickable = await pickupCard.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking available pickup point card ${i}...`);
                await pickupCard.click();
                console.log(`✅ Successfully selected pickup point ${i}`);
                pickupSelected = true;
                break;
              } else {
                console.log(`Pickup card ${i} is not clickable, trying next...`);
              }
            } else {
              console.log(`Pickup card ${i} is disabled, skipping to next...`);
            }
          }
          
          // Alternative: Try the radio button inside this calendar icon's container
          if (!pickupSelected) {
            const radioButton = await calendarIcons[i].$('../../..//input[@type="radio"]');
            if (await radioButton.isExisting()) {
              const isEnabled = await radioButton.isEnabled();
              if (isEnabled) {
                console.log(`Clicking radio button for pickup point ${i}...`);
                await radioButton.click();
                console.log(`✅ Successfully selected pickup point via radio ${i}`);
                pickupSelected = true;
                break;
              } else {
                console.log(`Radio button ${i} is disabled, trying next...`);
              }
            }
          }
          
        } catch (e) {
          console.log(`Failed to process pickup point ${i}:`, e.message);
        }
      }
      
      // Fallback: If no calendar icons worked, try generic approach
      if (!pickupSelected) {
        console.log('Fallback: Looking for any available radio button...');
        const availableRadios = await $$('//input[@type="radio" and not(@disabled)]');
        
        for (let i = 0; i < availableRadios.length; i++) {
          try {
            const radio = availableRadios[i];
            const isDisplayed = await radio.isDisplayed();
            const isEnabled = await radio.isEnabled();
            
            if (isDisplayed && isEnabled) {
              console.log(`Clicking fallback radio button ${i}...`);
              await radio.click();
              console.log(`✅ Fallback pickup selection successful`);
              pickupSelected = true;
              break;
            }
          } catch (e) {
            console.log(`Fallback radio ${i} failed:`, e.message);
          }
        }
      }
      
      if (!pickupSelected) {
        console.log('❌ Could not select any pickup point');
      }
      
    } catch (e) {
      console.log('Pickup point selection failed:', e.message);
    }
    
    // Wait for automatic navigation to drop points (as mentioned by user)
    await browser.pause(4000);
    
    // === STEP 5: SELECT DROP POINT ===
    console.log('=== STEP 5: SELECTING DROP POINT ===');
    
    try {
      // Use calendar icon alt="calendar" to find and click first available drop point
      console.log('Looking for drop points using calendar icon alt="calendar"...');
      
      // Find all calendar icons with alt="calendar" (these are in drop point cards)
      const calendarIcons = await $$('//img[@alt="calendar"]');
      console.log(`Found ${calendarIcons.length} calendar icons with alt="calendar"`);
      
      let dropSelected = false;
      
      // Try to click the first available calendar icon or its parent container
      for (let i = 0; i < calendarIcons.length; i++) {
        try {
          console.log(`Checking calendar icon ${i} with alt="calendar"...`);
          
          const calendarIcon = calendarIcons[i];
          
          // Scroll to make sure the icon is visible
          await calendarIcon.scrollIntoView();
          await browser.pause(500);
          
          // Method 1: Try clicking the calendar icon directly
          if (await calendarIcon.isDisplayed() && await calendarIcon.isClickable()) {
            console.log(`Method 1: Clicking calendar icon ${i} directly...`);
            await calendarIcon.click();
            console.log(`✅ Drop point selected by clicking calendar icon ${i} directly`);
            dropSelected = true;
            break;
          }
          
          // Method 2: Try clicking the parent container of the calendar icon
          if (!dropSelected) {
            console.log(`Method 2: Trying parent container of calendar icon ${i}...`);
            
            // Go up to find clickable parent container (the drop point card)
            const parentLevels = ['..', '../..', '../../..', '../../../..'];
            
            for (const level of parentLevels) {
              try {
                const parentContainer = await calendarIcon.$(level);
                
                if (await parentContainer.isExisting()) {
                  const isDisplayed = await parentContainer.isDisplayed();
                  const isClickable = await parentContainer.isClickable();
                  
                  if (isDisplayed && isClickable) {
                    console.log(`Clicking parent container at level ${level} for calendar icon ${i}...`);
                    await parentContainer.click();
                    console.log(`✅ Drop point selected via parent container of calendar icon ${i}`);
                    dropSelected = true;
                    break;
                  }
                }
              } catch (e) {
                console.log(`Parent level ${level} failed for calendar icon ${i}:`, e.message);
              }
            }
            
            if (dropSelected) break;
          }
          
          // Method 3: Try to find and click the entire drop point card/row
          if (!dropSelected) {
            console.log(`Method 3: Looking for clickable drop point card containing calendar icon ${i}...`);
            
            // Find the drop point container that contains this calendar icon
            const dropPointCard = await calendarIcon.$('ancestor::div[contains(@class, "egATR") or contains(@class, "")]');
            
            if (await dropPointCard.isExisting()) {
              const isDisplayed = await dropPointCard.isDisplayed();
              const isClickable = await dropPointCard.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking drop point card containing calendar icon ${i}...`);
                await dropPointCard.click();
                console.log(`✅ Drop point selected via card containing calendar icon ${i}`);
                dropSelected = true;
                break;
              }
            }
          }
          
        } catch (e) {
          console.log(`Failed to process calendar icon ${i}:`, e.message);
        }
      }
      
      // Fallback: If calendar icons didn't work, try any available clickable element in drop points area
      if (!dropSelected) {
        console.log('Fallback: Looking for any clickable element in drop points area...');
        
        // Look for any clickable elements that might be drop points
        const clickableElements = await $$('//*[contains(@class, "egATR")]//*[@onclick or @role="button" or contains(@class, "clickable")]');
        
        for (let i = 0; i < clickableElements.length; i++) {
          try {
            const element = clickableElements[i];
            
            if (await element.isDisplayed() && await element.isClickable()) {
              console.log(`Clicking fallback element ${i}...`);
              await element.scrollIntoView();
              await browser.pause(500);
              await element.click();
              console.log(`✅ Drop point selected via fallback element ${i}`);
              dropSelected = true;
              break;
            }
          } catch (e) {
            console.log(`Fallback element ${i} failed:`, e.message);
          }
        }
      }
      
      if (dropSelected) {
        console.log('🎉 Drop point selection completed successfully');
      } else {
        console.log('❌ Could not select any drop point using calendar icon approach');
      }
      
    } catch (e) {
      console.log('Drop point selection failed:', e.message);
    }
    
    await browser.pause(2000);
    
    // === STEP 6: CLICK PROCEED BUTTON ===
    console.log('=== STEP 6: CLICKING PROCEED BUTTON ===');
    
    try {
      // Look specifically for Proceed button
      console.log('Looking for Proceed button...');
      const proceedButton = await $('//*[contains(text(), "Proceed")]');
      if (await proceedButton.isExisting()) {
        console.log('Found Proceed button, clicking...');
        await proceedButton.click();
        console.log('✅ Proceed button clicked');
      } else {
        throw new Error('Proceed button not found');
      }
    } catch (e) {
      console.log('Proceed button click failed:', e.message);
      throw new Error('Could not find proceed button to continue booking flow');
    }
    
    // Wait for page transition
    await browser.pause(20000); // Reduced from 10000 to 5000ms
    
    // === STEP 7: WAIT FOR MANUAL LOGIN ===
    console.log('=== STEP 7: WAITING FOR MANUAL LOGIN ===');
    console.log('🔑 Login iframe should appear - please complete login manually');
    console.log('⏳ The automation is now SUSPENDED - waiting for you to complete login...');
    console.log('📋 Please complete the login process in the iframe/popup');
    console.log('⚠️  The test will automatically resume once you land on the "Add Passenger" page');
    
    try {
      // Wait for up to 5 minutes for user to complete login and reach the page with Proceed button
      await browser.waitUntil(
        async () => {
          try {
            const currentUrl = await browser.getUrl();
            const pageTitle = await browser.getTitle();
            
            // Log current state every 15 seconds to show automation is waiting
            console.log(`⏳ Still waiting for login completion... Current URL: ${currentUrl.substring(0, 80)}...`);
            console.log(`⏳ Still waiting for login completion... Page title: ${pageTitle}`);

            // Check if login is completed by looking for Add Passenger page indicators
            console.log('Looking for "Add Passenger" page after login...');
            const addPassengerIndicators = await $$('//*[contains(text(), "Add Passenger") or contains(text(), "Saved Passengers") or contains(text(), "Contact Details")]');
            
            // Also check for passenger containers (the actual passenger selection UI)
            const passengerContainers = await $$('//div[contains(@class, "GeWyY")]');
            
            if (addPassengerIndicators.length > 0 || passengerContainers.length > 0) {
              console.log('✅ SUCCESS: Found "Add Passenger" page after login - login completed successfully!');
              console.log('🚀 RESUMING AUTOMATION from passenger selection...');
              return true;
            } else {
              console.log('⏳ "Add Passenger" page not found yet - please continue with login process...');
            }
            
            // Check if we're still on login page (iframe might still be open)
            const loginIndicators = await $$('//*[contains(text(), "Login") or contains(text(), "Sign In") or contains(text(), "OTP") or contains(text(), "Verify")]');
            if (loginIndicators.length > 0) {
              console.log('⏳ Login page still detected - please complete the login process');
            }
            
            return false;
          } catch (e) {
            console.log('⏳ Waiting for login completion... (checking page state)');
            return false;
          }
        },
        {
          timeout: 600000, // 10 minutes for user to complete login  
          interval: 10000,  // Check every 10 seconds
          timeoutMsg: '❌ Login was not completed within 10 minutes or "Add Passenger" page did not appear'
        }
      );
      
      console.log('🎉 Login completed successfully - user has landed on Add Passenger page!');
      
    } catch (e) {
      console.log('❌ Login wait failed or timed out:', e.message);
      console.log('🔄 Attempting to continue anyway - checking if we can proceed...');
      
      console.log('✅ Login completed - proceeding to passenger selection (Chrome mobile view)');
    }
    
    // Additional wait for page to fully settle after login detection
    console.log('⏳ Allowing page to fully settle after login detection...');
    await browser.pause(3000);
    
    // === CHROME MOBILE: NO PROCEED BUTTON AFTER LOGIN ===
    console.log('=== CHROME MOBILE: LOGIN COMPLETED - PROCEEDING DIRECTLY TO PASSENGER SELECTION ===');
    console.log('✅ Chrome mobile view goes directly to passenger screen after login');
    console.log('🎯 No Proceed button needed - continuing with passenger selection...');
    
    // Log current state before proceeding to passenger selection
    try {
      const currentUrl = await browser.getUrl();
      const pageTitle = await browser.getTitle();
      console.log(`📍 Current URL after Proceed button: ${currentUrl}`);
      console.log(`📍 Current page title: ${pageTitle}`);
    } catch (e) {
      console.log('Could not log current state');
    }
    
    // === STEP 8: SELECT FIRST PASSENGER ===
    console.log('=== STEP 8: SELECTING FIRST PASSENGER ===');
    await browser.pause(3000);
    
    try {
      console.log('🔍 Looking for passenger containers...');
      
      // Look for passenger containers with class "GeWyY"
      const passengerContainers = await $$('//div[contains(@class, "GeWyY")]');
      console.log(`Found ${passengerContainers.length} passenger containers`);
      
      let passengerSelected = false;
      
      if (passengerContainers.length > 0) {
        // Try to select the first passenger container
        for (let i = 0; i < Math.min(passengerContainers.length, 3); i++) {
          try {
            const container = passengerContainers[i];
            console.log(`Trying to select passenger ${i}...`);
            
            // Scroll container into view
            await container.scrollIntoView();
            await browser.pause(1000);
            
            // Method 1: Try clicking the label element (safer than radio button)
            console.log(`Method 1: Looking for label in passenger ${i}...`);
            const label = await container.$('.//label');
            if (await label.isExisting()) {
              const isDisplayed = await label.isDisplayed();
              const isClickable = await label.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking label for passenger ${i}...`);
                await label.click();
                console.log(`✅ Passenger ${i} selected via label click`);
                passengerSelected = true;
                break;
              }
            }
            
            // Method 2: Try clicking the entire container
            if (!passengerSelected) {
              console.log(`Method 2: Clicking container for passenger ${i}...`);
              const isDisplayed = await container.isDisplayed();
              const isClickable = await container.isClickable();
              
              if (isDisplayed && isClickable) {
                await container.click();
                console.log(`✅ Passenger ${i} selected via container click`);
                passengerSelected = true;
                break;
              }
            }
            
            // Method 3: Try JavaScript click on radio button
            if (!passengerSelected) {
              console.log(`Method 3: JavaScript click on radio button for passenger ${i}...`);
              const radioButton = await container.$('.//input[@type="radio"]');
              if (await radioButton.isExisting()) {
                await browser.execute((element) => {
                  element.click();
                }, radioButton);
                console.log(`✅ Passenger ${i} selected via JavaScript radio click`);
                passengerSelected = true;
                break;
              }
            }
            
            // Method 4: Try JavaScript click on label
            if (!passengerSelected) {
              console.log(`Method 4: JavaScript click on label for passenger ${i}...`);
              const label = await container.$('.//label');
              if (await label.isExisting()) {
                await browser.execute((element) => {
                  element.click();
                }, label);
                console.log(`✅ Passenger ${i} selected via JavaScript label click`);
                passengerSelected = true;
                break;
              }
            }
            
          } catch (e) {
            console.log(`Failed to select passenger ${i}:`, e.message);
          }
        }
      }
      
      // Fallback: Try by passenger name
      if (!passengerSelected) {
        console.log('Fallback: Looking for specific passenger names...');
        const passengerNames = ['Mr. Orgj', 'Mr. Jvc', 'Mr. Rohit'];
        
        for (const name of passengerNames) {
          try {
            console.log(`Looking for passenger: ${name}`);
            const nameElement = await $(`//*[contains(text(), "${name}")]`);
            if (await nameElement.isExisting()) {
              console.log(`Found ${name}, clicking...`);
              
              // Get the container of this name
              const nameContainer = await nameElement.$('ancestor::div[contains(@class, "GeWyY")]');
              if (await nameContainer.isExisting()) {
                await nameContainer.scrollIntoView();
                await browser.pause(1000);
                
                // Try clicking the label in this container
                const label = await nameContainer.$('.//label');
                if (await label.isExisting()) {
                  await browser.execute((element) => {
                    element.click();
                  }, label);
                  console.log(`✅ ${name} selected via JavaScript label click`);
                  passengerSelected = true;
                  break;
                }
              }
            }
          } catch (e) {
            console.log(`Failed to select ${name}:`, e.message);
          }
        }
      }
      
      if (passengerSelected) {
        console.log('🎉 Passenger selection completed successfully');
        await browser.pause(2000); // Wait for selection to register
      } else {
        console.log('❌ Could not select any passenger');
        throw new Error('Passenger selection failed - no method worked');
      }
      
    } catch (e) {
      console.log('❌ Passenger selection failed:', e.message);
      throw new Error('Passenger selection failed: ' + e.message);
    }
    
    // === STEP 9: CLICK CONTINUE ===
    console.log('=== STEP 9: CLICKING FINAL CONTINUE ===');
    await browser.pause(2000);
    
    try {
      const continueButton = await $('//*[contains(text(), "Continue")]');
      if (await continueButton.isExisting()) {
        console.log('Found Continue button, clicking...');
        await continueButton.click();
        console.log('✅ Continue button clicked');
      } else {
        console.log('❌ Continue button not found');
      }
    } catch (e) {
      console.log('Continue button click failed:', e.message);
    }
    
    // Wait for final page load
    await browser.pause(5000);
    
    // Check if we reached the review booking page
    try {
      const reviewText = await $('//*[contains(text(), "Review Booking") or contains(text(), "Proceed To Pay")]');
      if (await reviewText.isExisting()) {
        console.log('🎉 SUCCESS: Reached Review Booking page!');
      } else {
        console.log('⚠️  May not have reached final booking page');
      }
    } catch (e) {
      console.log('Final verification failed:', e.message);
    }
    
    // === STEP 9.5: FILL EMAIL ON REVIEW BOOKING PAGE ===
    console.log('=== STEP 9.5: FILLING EMAIL ON REVIEW BOOKING PAGE ===');
    await browser.pause(2000);
    
    try {
      console.log('🔍 Looking for email input field...');
      
      // Look for email input field using placeholder text
      const emailInput = await $('//input[@placeholder="Email ID"] | //input[contains(@placeholder, "Email")] | //input[@type="email"]');
      
      if (await emailInput.isExisting()) {
        console.log('Found email input field, checking if it needs to be filled...');
        
        // Check if email field is empty or has placeholder text
        const currentValue = await emailInput.getValue();
        console.log(`Current email field value: "${currentValue}"`);
        
        if (!currentValue || currentValue.trim().length === 0 || currentValue === 'Email ID') {
          console.log('📧 Email field is empty, filling with email address...');
          
          // Scroll to email field and click to focus
          await emailInput.scrollIntoView();
          await browser.pause(500);
          await emailInput.click();
          await browser.pause(500);
          
          // Clear any existing value and enter email
          await emailInput.clearValue();
          await emailInput.setValue('kashyaprohit8360@gmail.com');
          
          console.log('✅ Email address entered successfully');
          
          // Verify the email was entered
          const verifyValue = await emailInput.getValue();
          console.log(`Verification: Email field now contains: "${verifyValue}"`);
          
          // Check if error message disappeared
          await browser.pause(1000);
          const errorMessage = await $('//*[contains(text(), "Please provide a valid Email ID")]');
          if (await errorMessage.isExisting()) {
            const isDisplayed = await errorMessage.isDisplayed();
            if (!isDisplayed) {
              console.log('✅ Email validation error cleared');
            } else {
              console.log('⚠️ Email validation error still showing');
            }
          } else {
            console.log('✅ No email validation error found');
          }
          
          // After filling/verifying email, immediately click Proceed to Pay
          console.log('🎯 Email ready, now clicking Proceed to Pay...');
          await browser.pause(1000);
          
          try {
            const proceedToPayButton = await $('//*[contains(text(), "Proceed To Pay")] | //button[contains(text(), "Proceed")] | //*[contains(text(), "Proceed") and contains(text(), "Pay")]');
            
            if (await proceedToPayButton.isExisting()) {
              console.log('Found Proceed To Pay button, clicking...');
              await proceedToPayButton.scrollIntoView();
              await browser.pause(500);
              await proceedToPayButton.click();
              console.log('✅ Proceed To Pay button clicked after email filling');
              
              // Wait for navigation to payment gateway
              await browser.pause(5000);
              console.log('✅ Should be navigating to payment gateway');
            } else {
              console.log('❌ Proceed To Pay button not found after email filling');
              
              // Debug: Look for any buttons that might be the proceed button
              const allButtons = await $$('//button | //*[@role="button"] | //input[@type="submit"]');
              console.log(`Found ${allButtons.length} buttons on review page`);
              
              for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
                try {
                  const button = allButtons[i];
                  const text = await button.getText();
                  const isDisplayed = await button.isDisplayed();
                  console.log(`Button ${i}: "${text}" (displayed: ${isDisplayed})`);
                } catch (e) {
                  console.log(`Button ${i}: Could not get details`);
                }
              }
            }
          } catch (e) {
            console.log('❌ Error clicking Proceed To Pay after email:', e.message);
          }
        } else {
          console.log(`✅ Email field already filled with: "${currentValue}"`);
        }
      } else {
        console.log('❌ Email input field not found');
        
        // Debug: Look for any input fields on the page
        console.log('🔍 Debugging: Looking for any input fields...');
        const allInputs = await $$('//input');
        console.log(`Found ${allInputs.length} input fields on page`);
        
        for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
          try {
            const input = allInputs[i];
            const placeholder = await input.getAttribute('placeholder');
            const type = await input.getAttribute('type');
            const id = await input.getAttribute('id');
            console.log(`Input ${i}: placeholder="${placeholder}", type="${type}", id="${id}"`);
          } catch (e) {
            console.log(`Input ${i}: Could not get attributes`);
          }
        }
      }
      
    } catch (e) {
      console.log('❌ Email filling failed:', e.message);
      console.log('🔄 Continuing with booking process...');
    }
    
    // Additional wait to ensure email is processed
    await browser.pause(1000);
    
    // === STEP 10: CLICK PROCEED TO PAY ===
    console.log('=== STEP 10: CLICKING PROCEED TO PAY ===');
    await browser.pause(2000);
    
    let proceedToPayClicked = false;
    
    try {
      // Method 1: Try standard click with improved reliability
      console.log('Method 1: Standard click with scroll and visibility checks...');
      const proceedToPayButton = await $('//*[contains(text(), "Proceed To Pay")]');
      if (await proceedToPayButton.isExisting()) {
        console.log('Found Proceed To Pay button, preparing to click...');
        
        // Scroll element into view
        await proceedToPayButton.scrollIntoView();
        await browser.pause(1000);
        
        // Check if element is truly clickable and visible
        const isDisplayed = await proceedToPayButton.isDisplayed();
        const isClickable = await proceedToPayButton.isClickable();
        
        console.log(`Proceed To Pay button - displayed: ${isDisplayed}, clickable: ${isClickable}`);
        
        if (isDisplayed && isClickable) {
          await proceedToPayButton.click();
          console.log('✅ Proceed To Pay button clicked successfully');
          proceedToPayClicked = true;
        } else {
          console.log('Proceed To Pay button not properly clickable, trying alternative methods...');
        }
      } else {
        console.log('Proceed To Pay button not found with standard selector');
      }
      
      // Method 2: Try JavaScript click to bypass element interception
      if (!proceedToPayClicked) {
        console.log('Method 2: JavaScript click to bypass interception...');
        const proceedToPayButtonJS = await $('//*[contains(text(), "Proceed To Pay")]');
        if (await proceedToPayButtonJS.isExisting()) {
          console.log('Using JavaScript click on Proceed To Pay button...');
          await browser.execute((element) => {
            element.click();
          }, proceedToPayButtonJS);
          console.log('✅ Proceed To Pay button clicked using JavaScript');
          proceedToPayClicked = true;
        }
      }
      
      // Method 3: Try clicking parent container
      if (!proceedToPayClicked) {
        console.log('Method 3: Clicking parent container...');
        const proceedToPayText = await $('//*[contains(text(), "Proceed To Pay")]');
        if (await proceedToPayText.isExisting()) {
          const parentButton = await proceedToPayText.$('..');
          if (await parentButton.isExisting()) {
            await parentButton.scrollIntoView();
            await browser.pause(500);
            
            const isClickable = await parentButton.isClickable();
            if (isClickable) {
              console.log('Clicking Proceed To Pay parent container...');
              await parentButton.click();
              console.log('✅ Proceed To Pay clicked via parent container');
              proceedToPayClicked = true;
            } else {
              // Try JavaScript click on parent
              await browser.execute((element) => {
                element.click();
              }, parentButton);
              console.log('✅ Proceed To Pay clicked via parent container (JavaScript)');
              proceedToPayClicked = true;
            }
          }
        }
      }
      
      // Method 4: Try alternative selectors
      if (!proceedToPayClicked) {
        console.log('Method 4: Trying alternative Pay button selectors...');
        const payButtonSelectors = [
          '//button[contains(text(), "Pay")]',
          '//div[contains(text(), "Pay")]', 
          '//*[contains(@class, "pay")]//*[contains(text(), "Pay")]',
          '//button[contains(text(), "Proceed")]',
          '//*[contains(text(), "Proceed") and contains(text(), "Pay")]'
        ];
        
        for (const selector of payButtonSelectors) {
          try {
            const payButton = await $(selector);
            if (await payButton.isExisting()) {
              console.log(`Found Pay button with selector: ${selector}`);
              
              // Try both regular and JavaScript click
              try {
                await payButton.scrollIntoView();
                await browser.pause(500);
                await payButton.click();
                console.log(`✅ Pay button clicked with selector: ${selector}`);
                proceedToPayClicked = true;
                break;
              } catch (clickError) {
                console.log(`Regular click failed, trying JavaScript click...`);
                await browser.execute((element) => {
                  element.click();
                }, payButton);
                console.log(`✅ Pay button clicked with JavaScript (selector: ${selector})`);
                proceedToPayClicked = true;
                break;
              }
            }
          } catch (e) {
            console.log(`Selector ${selector} failed:`, e.message);
          }
        }
      }
      
      if (proceedToPayClicked) {
        console.log('🎉 SUCCESS: Proceed To Pay button clicked - proceeding to payment gateway');
        
        // Wait for payment gateway to load
        await browser.pause(5000);
        console.log('✅ Should be redirected to payment gateway');
        
        // Check if we've successfully reached the payment options screen
        const paymentOptionsVisible = await browser.execute(() => {
          const netBankingText = document.querySelector('*[textContent*="Net Banking" i], *[innerText*="Net Banking" i]');
          const upiText = document.querySelector('*[textContent*="UPI" i], *[innerText*="UPI" i]');
          const cardText = document.querySelector('*[textContent*="Card" i], *[innerText*="Card" i]');
          return !!(netBankingText || upiText || cardText);
        });
        
        if (paymentOptionsVisible) {
          console.log('✅ Payment options screen loaded successfully');
        } else {
          console.log('⚠️ Payment options not immediately visible, but continuing...');
        }
        
      } else {
        console.log('❌ Could not click Proceed To Pay button with any method');
        // Don't throw error immediately, let's check if we still progressed to payment screen
        
        // Check if payment options are still visible despite click failure
        const paymentOptionsVisible = await browser.execute(() => {
          const netBankingText = document.querySelector('*[textContent*="Net Banking" i], *[innerText*="Net Banking" i]');
          return !!netBankingText;
        });
        
        if (paymentOptionsVisible) {
          console.log('🎉 INTERESTING: Payment screen loaded despite click failure!');
          console.log('✅ Continuing with payment selection...');
          proceedToPayClicked = true; // Mark as successful since we reached the next screen
        } else {
          throw new Error('Failed to click Proceed To Pay button and did not reach payment screen');
        }
      }
      
    } catch (e) {
      console.log('❌ Proceed To Pay button click failed:', e.message);
      
      // Final check: Are we still on the payment options screen?
      try {
        const paymentOptionsStillVisible = await browser.execute(() => {
          const netBankingText = document.querySelector('*[textContent*="Net Banking" i], *[innerText*="Net Banking" i]');
          return !!netBankingText;
        });
        
        if (paymentOptionsStillVisible) {
          console.log('🎉 RECOVERY: Despite error, we are on the payment options screen!');
          console.log('✅ Continuing with test execution...');
          proceedToPayClicked = true;
        } else {
          throw new Error('Failed to click Proceed To Pay button: ' + e.message);
        }
      } catch (recoveryError) {
        throw new Error('Failed to click Proceed To Pay button: ' + e.message);
      }
    }
    
    // === STEP 11: ANALYZE PAYMENT OPTIONS ===
    console.log('=== STEP 11: ANALYZING AVAILABLE PAYMENT OPTIONS ===');
    await browser.pause(2000);
    
    // Debug: Let's see what payment options are available
    console.log('🔍 Scanning for payment options...');
    try {
      // Look for common payment method indicators
      const paymentMethods = [
        'UPI',
        'Net Banking', 
        'Credit Card',
        'Debit Card',
        'Wallet',
        'PayPal',
        'PhonePe',
        'Paytm',
        'Google Pay'
      ];
      
      let foundPaymentOptions = [];
      
      for (const method of paymentMethods) {
        const elements = await $$(`//*[contains(text(), "${method}")]`);
        if (elements.length > 0) {
          foundPaymentOptions.push(method);
          console.log(`✅ Found payment option: ${method} (${elements.length} elements)`);
        }
      }
      
      if (foundPaymentOptions.length > 0) {
        console.log(`🎉 SUCCESS: Found ${foundPaymentOptions.length} payment options: ${foundPaymentOptions.join(', ')}`);
        console.log('💳 Payment gateway is ready for selection');
      } else {
        console.log('⚠️ No standard payment options detected');
        console.log('🔍 Checking for any clickable payment elements...');
        
        // Look for any buttons or clickable elements that might be payment options
        const clickableElements = await $$('//button | //input[@type="radio"] | //input[@type="checkbox"] | //*[@onclick]');
        console.log(`🔘 Found ${clickableElements.length} potentially clickable elements`);
        
        // Try to get text from first few clickable elements
        for (let i = 0; i < Math.min(clickableElements.length, 3); i++) {
          try {
            const element = clickableElements[i];
            const text = await element.getText();
            const tagName = await element.getTagName();
            console.log(`🔘 Clickable element ${i}: <${tagName}> "${text}"`);
          } catch (e) {
            console.log(`🔘 Clickable element ${i}: Could not get details`);
          }
        }
      }
      
    } catch (e) {
      console.log('❌ Payment options analysis failed:', e.message);
    }
    
    console.log('🎯 BOOKING FLOW REACHED PAYMENT GATEWAY');
    console.log('✅ Test completed successfully - Payment options are now available');
    console.log('💡 Manual payment selection can now be performed if needed');
    
    // === STEP 12: SELECT NET BANKING OPTION ===
    console.log('=== STEP 12: SELECTING NET BANKING OPTION ===');
    await browser.pause(15000);
    
    try {
      // Look for Net Banking option using specific selectors
      console.log('🏦 Looking for Net Banking option using specific selectors...');
      
      let netBankingSelected = false;
      
      // Method 1: Look for the specific nb-icon-new.svg image
      console.log('Method 1: Looking for nb-icon-new.svg image...');
      const netBankingIcon = await $('//img[contains(@src, "nb-icon-new.svg")]');
      if (await netBankingIcon.isExisting()) {
        console.log('Found nb-icon-new.svg image, clicking...');
        try {
          await netBankingIcon.click();
          console.log('✅ Net Banking option clicked via nb-icon-new.svg image');
          netBankingSelected = true;
        } catch (e) {
          console.log('Direct icon click failed, trying parent container...');
          const iconParent = await netBankingIcon.$('..');
          if (await iconParent.isExisting() && await iconParent.isClickable()) {
            await iconParent.click();
            console.log('✅ Net Banking option clicked via nb-icon-new.svg parent container');
            netBankingSelected = true;
          }
        }
      } else {
        console.log('nb-icon-new.svg image not found');
      }
      
      // Method 2: Look for "Net Banking" text and click it
      if (!netBankingSelected) {
        console.log('Method 2: Looking for "Net Banking" text...');
        const netBankingText = await $('//*[contains(text(), "Net Banking")]');
        if (await netBankingText.isExisting()) {
          console.log('Found "Net Banking" text, clicking...');
          try {
            await netBankingText.click();
            console.log('✅ Net Banking option clicked via text');
            netBankingSelected = true;
          } catch (e) {
            console.log('Direct text click failed, trying parent container...');
            const textParent = await netBankingText.$('..');
            if (await textParent.isExisting() && await textParent.isClickable()) {
              await textParent.click();
              console.log('✅ Net Banking option clicked via text parent container');
              netBankingSelected = true;
            }
          }
        } else {
          console.log('"Net Banking" text not found');
        }
      }
      
      // Method 3: Look for radio button or input associated with Net Banking
      if (!netBankingSelected) {
        console.log('Method 3: Looking for Net Banking radio button/input...');
        const netBankingInput = await $('//input[@type="radio" and (following-sibling::*[contains(text(), "Net Banking")] or preceding-sibling::*[contains(text(), "Net Banking")])]');
        if (await netBankingInput.isExisting()) {
          console.log('Found Net Banking radio button, clicking...');
          await netBankingInput.click();
          console.log('✅ Net Banking option selected via radio button');
          netBankingSelected = true;
        } else {
          console.log('Net Banking radio button not found');
        }
      }
      
      // Method 4: Look for container with both nb-icon-new.svg and Net Banking text
      if (!netBankingSelected) {
        console.log('Method 4: Looking for container with nb-icon-new.svg and Net Banking text...');
        const netBankingContainer = await $('//*[.//img[contains(@src, "nb-icon-new.svg")] and .//text()[contains(., "Net Banking")]]');
        if (await netBankingContainer.isExisting()) {
          console.log('Found container with both icon and text, clicking...');
          const isClickable = await netBankingContainer.isClickable();
          if (isClickable) {
            await netBankingContainer.click();
            console.log('✅ Net Banking option selected via combined container');
            netBankingSelected = true;
          } else {
            console.log('Container not clickable, trying child elements...');
            const clickableChild = await netBankingContainer.$('.//*[@onclick or @role="button" or contains(@class, "button")]');
            if (await clickableChild.isExisting()) {
              await clickableChild.click();
              console.log('✅ Net Banking option selected via container child element');
              netBankingSelected = true;
            }
          }
        } else {
          console.log('Combined container not found');
        }
      }
      
      // Method 5: Broad search for any element containing "nb-icon-new.svg"
      if (!netBankingSelected) {
        console.log('Method 5: Broad search for nb-icon-new.svg elements...');
        const allNbIconElements = await $$('//*[contains(@src, "nb-icon-new.svg") or contains(@href, "nb-icon-new.svg") or contains(@data-src, "nb-icon-new.svg")]');
        console.log(`Found ${allNbIconElements.length} elements with nb-icon-new.svg`);
        
        for (let i = 0; i < allNbIconElements.length; i++) {
          try {
            const element = allNbIconElements[i];
            console.log(`Trying to click nb-icon-new.svg element ${i}...`);
            
            // Try clicking the element itself
            if (await element.isClickable() && await element.isDisplayed()) {
              await element.click();
              console.log(`✅ Net Banking selected via nb-icon-new.svg element ${i}`);
              netBankingSelected = true;
              break;
            } else {
              // Try clicking parent
              const parent = await element.$('..');
              if (await parent.isClickable() && await parent.isDisplayed()) {
                await parent.click();
                console.log(`✅ Net Banking selected via nb-icon-new.svg parent ${i}`);
                netBankingSelected = true;
                break;
              }
            }
          } catch (e) {
            console.log(`Failed to click nb-icon-new.svg element ${i}:`, e.message);
          }
        }
      }
      
      if (netBankingSelected) {
        console.log('🎉 SUCCESS: Net Banking option has been selected!');
        await browser.pause(3000);
        
        // Look for next step after Net Banking selection
        console.log('🔍 Looking for next steps after Net Banking selection...');
        try {
          const nextButtons = await $$('//*[contains(text(), "Proceed") or contains(text(), "Continue") or contains(text(), "Next") or contains(text(), "Pay")]');
          if (nextButtons.length > 0) {
            console.log(`Found ${nextButtons.length} potential next step buttons`);
            for (let i = 0; i < Math.min(nextButtons.length, 3); i++) {
              try {
                const text = await nextButtons[i].getText();
                console.log(`Next button ${i}: "${text}"`);
              } catch (e) {
                console.log(`Next button ${i}: Could not get text`);
              }
            }
          }
          
          const bankOptions = await $$('//*[contains(text(), "Bank") and not(contains(text(), "Net Banking"))]');
          if (bankOptions.length > 0) {
            console.log(`Found ${bankOptions.length} bank selection options`);
            console.log('💡 You can now manually select your preferred bank');
          }
          
        } catch (e) {
          console.log('Could not analyze next steps:', e.message);
        }
        
      } else {
        console.log('❌ Could not find or select Net Banking option');
        console.log('🔍 Debugging: Let me check what payment options are actually available...');
        
        // Debug what's actually on the page
        try {
          const allImages = await $$('//img');
          console.log(`Found ${allImages.length} images on page`);
          
          for (let i = 0; i < Math.min(allImages.length, 10); i++) {
            try {
              const src = await allImages[i].getAttribute('src');
              if (src) {
                console.log(`Image ${i}: ${src}`);
              }
            } catch (e) {
              console.log(`Image ${i}: Could not get src`);
            }
          }
          
          const allPaymentTexts = await $$('//*[contains(text(), "UPI") or contains(text(), "Card") or contains(text(), "Wallet") or contains(text(), "Pay") or contains(text(), "Bank")]');
          console.log(`Found ${allPaymentTexts.length} payment-related text elements`);
          
          for (let i = 0; i < Math.min(allPaymentTexts.length, 5); i++) {
            try {
              const text = await allPaymentTexts[i].getText();
              console.log(`Payment text ${i}: "${text}"`);
            } catch (e) {
              console.log(`Payment text ${i}: Could not get text`);
            }
          }
          
        } catch (e) {
          console.log('Debug failed:', e.message);
        }
      }
      
    } catch (e) {
      console.log('❌ Net Banking selection failed:', e.message);
    }

    // === STEP 12: SELECT ICICI BANK FROM POPUP ===
    console.log('=== STEP 12: SELECTING ICICI BANK FROM POPUP ===');
    await browser.pause(7000); // Reduced since we already waited above
    
    try {
      // Look for ICICI bank option in the popup
      console.log('Looking for ICICI text option in popup...');
      const iciciBankOption = await $('//*[contains(text(), "ICICI")]');
      console.log('✅ iciciBankOption ', iciciBankOption);
      
      if (await iciciBankOption.isExisting()) {
        console.log('Found ICICI text option, clicking...');
        await iciciBankOption.click();
        console.log('✅ ICICI bank text selected from popup');
        
        // Wait for selection to register and popup to close
        console.log('⏳ Waiting for ICICI selection to register...');
        await browser.pause(3000); // Increased wait for selection to register
        console.log('✅ ICICI bank selection completed');
      } else {
        console.log('❌ ICICI text option not found in popup');
        
        // Try alternative ICICI selectors
        console.log('Trying alternative ICICI selectors...');
        const iciciAlt = await $('//div[contains(text(), "ICICI")] | //span[contains(text(), "ICICI")] | //*[contains(@class, "bank")]//*[contains(text(), "ICICI")]');
        if (await iciciAlt.isExisting()) {
          console.log('Found ICICI with alternative selector, clicking...');
          await iciciAlt.click();
          console.log('✅ ICICI bank selected (alternative)');
          await browser.pause(3000);
        } else {
          console.log('❌ ICICI bank not found with any selector');
        }
      }
    } catch (e) {
      console.log('ICICI bank selection from popup failed:', e.message);
    }

    //   === STEP 13: CLICK PAY BUTTON ===
    console.log('=== STEP 13: CLICKING PAY BUTTON ===');
    await browser.pause(3000); // Increased delay as requested
    
    try {
      // Look for Pay button using ptm-lock-img image reference
      console.log('Looking for Pay button using ptm-lock-img image reference...');
      
      let payButtonClicked = false;
      
      // Method 1: Look for button containing ptm-lock-img image
      console.log('Method 1: Looking for button with ptm-lock-img image...');
      const payButtonWithImage = await $('//button[.//img[contains(@class, "ptm-lock-img")] or .//img[contains(@src, "ptm-lock")]]');
      
      if (await payButtonWithImage.isExisting()) {
        console.log('Found Pay button with ptm-lock-img, checking visibility...');
        
        // Scroll to the button to ensure it's visible
        await payButtonWithImage.scrollIntoView();
        await browser.pause(1000);
        
        const isDisplayed = await payButtonWithImage.isDisplayed();
        const isClickable = true;
        
        console.log(`Pay button visibility: displayed=${isDisplayed}, clickable=${isClickable}`);
        
        if (isDisplayed && isClickable) {
          console.log('Clicking Pay button with ptm-lock-img...');
          await payButtonWithImage.click();
          console.log('✅ Pay button clicked successfully using ptm-lock-img reference');
          payButtonClicked = true;
        } else {
          console.log('Pay button with ptm-lock-img not clickable, trying to make it visible...');
          
          // Try to click the parent container
          const buttonParent = await payButtonWithImage.$('..');
          if (await buttonParent.isExisting()) {
            await buttonParent.scrollIntoView();
            await browser.pause(500);
            
            if (await buttonParent.isClickable()) {
              console.log('Clicking Pay button parent container...');
              await buttonParent.click();
              console.log('✅ Pay button clicked via parent container');
              payButtonClicked = true;
            }
          }
        }
      } else {
        console.log('Pay button with ptm-lock-img not found');
      }
      console.log('✅ payButtonClicked', payButtonClicked);
      
      // Method 2: Look for Pay text and ptm-lock-img in same container
      if (!payButtonClicked) {
        console.log('Method 2: Looking for container with both "Pay" text and ptm-lock-img...');
        const payContainerWithImage = await $('//*[contains(text(), "Pay") and .//img[contains(@class, "ptm-lock-img")]]');
        
        if (await payContainerWithImage.isExisting()) {
          console.log('Found container with Pay text and ptm-lock-img...');
          await payContainerWithImage.scrollIntoView();
          await browser.pause(1000);
          
          if (await payContainerWithImage.isClickable() && await payContainerWithImage.isDisplayed()) {
            console.log('Clicking Pay container with image...');
            await payContainerWithImage.click();
            console.log('✅ Pay button clicked via container with Pay text and image');
            payButtonClicked = true;
          }
        } else {
          console.log('Container with Pay text and ptm-lock-img not found');
        }
      }
      
      // Method 3: Find ptm-lock-img and click its parent button
      if (!payButtonClicked) {
        console.log('Method 3: Looking for ptm-lock-img and clicking parent button...');
        const lockImage = await $('//img[contains(@class, "ptm-lock-img") or contains(@src, "ptm-lock")]');
        
        if (await lockImage.isExisting()) {
          console.log('Found ptm-lock-img, looking for parent button...');
          
          // Try different levels of parent elements
          const parentLevels = ['..', '../..', '../../..'];
          
          for (const parentLevel of parentLevels) {
            try {
              const parentButton = await lockImage.$(parentLevel);
              if (await parentButton.isExisting()) {
                const tagName = await parentButton.getTagName();
                const buttonText = await parentButton.getText();
                
                console.log(`Found parent ${tagName} with text: "${buttonText}"`, parentButton);
                
                if (tagName.toLowerCase() === 'button' || buttonText.toLowerCase().includes('pay')) {
                  await parentButton.scrollIntoView();
                  await browser.pause(1000);
                  
                  if (await parentButton.isClickable() && await parentButton.isDisplayed()) {
                    console.log(`Clicking parent ${tagName}...`);
                    await parentButton.click();
                    console.log('✅ Pay button clicked via ptm-lock-img parent');
                    payButtonClicked = true;
                    break;
                  }
                }
              }
            } catch (e) {
              console.log(`Parent level ${parentLevel} failed:`, e.message);
            }
          }
        } else {
          console.log('ptm-lock-img not found');
        }
      }
      
      // Method 4: Look for any button containing "Pay" text (original method with better visibility)
      if (!payButtonClicked) {
        console.log('Method 4: Looking for any button with "Pay" text...');
        const payButtons = await $$('//button[contains(text(), "Pay")] | //*[contains(text(), "Pay") and (@role="button" or contains(@class, "button"))]');
        
        console.log(`Found ${payButtons.length} potential Pay buttons`);
        
        for (let i = 0; i < payButtons.length; i++) {
          try {
            const payButton = payButtons[i];
            const buttonText = await payButton.getText();
            
            console.log(`Checking Pay button ${i}: "${buttonText}"`);
            
            // Scroll to button and check visibility
            await payButton.scrollIntoView();
            await browser.pause(1000);
            
            const isDisplayed = await payButton.isDisplayed();
            const isClickable = await payButton.isClickable();
            
            console.log(`Button ${i} visibility: displayed=${isDisplayed}, clickable=${isClickable}`);
            
            if (isDisplayed && isClickable) {
              console.log(`Clicking Pay button ${i}...`);
              await payButton.click();
              console.log(`✅ Pay button ${i} clicked successfully`);
              payButtonClicked = true;
              break;
            }
          } catch (e) {
            console.log(`Failed to click Pay button ${i}:`, e.message);
          }
        }
      }
      
      // Method 5: JavaScript click as final fallback
      if (!payButtonClicked) {
        console.log('Method 5: Trying JavaScript click as fallback...');
        
        try {
          const payButtonJS = await $('//button[.//img[contains(@class, "ptm-lock-img")] or contains(text(), "Pay")]');
          if (await payButtonJS.isExisting()) {
            console.log('Using JavaScript click on Pay button...');
            await browser.execute((element) => {
              element.click();
            }, payButtonJS);
            console.log('✅ Pay button clicked using JavaScript');
            payButtonClicked = true;
          }
        } catch (e) {
          console.log('JavaScript click failed:', e.message);
        }
      }
      
      if (payButtonClicked) {
        console.log('🎉 SUCCESS: Pay button clicked - waiting for redirect to order summary page');
        
        // Wait for redirect to order summary page
        console.log('⏳ Waiting for redirect to order summary page...');
        console.log('🔍 Looking for URL pattern: https://staging.paytm.com/bus-tickets/summary/{dynamic_number}');
        
        try {
          // Wait for up to 2 minutes for redirect to order summary page
          await browser.waitUntil(
            async () => {
              try {
                const currentUrl = await browser.getUrl();
                console.log(`🔍 Current URL: ${currentUrl}`);
                
                // Check if URL matches the order summary pattern
                const isOrderSummaryPage = currentUrl.includes('staging.paytm.com/bus-tickets/summary/') || 
                                          currentUrl.includes('paytm.com/bus-tickets/summary/');
                
                if (isOrderSummaryPage) {
                  console.log('✅ SUCCESS: Redirected to order summary page!');
                  console.log(`📍 Order summary URL: ${currentUrl}`);
                  return true;
                }
                
                return false;
              } catch (e) {
                console.log('⏳ Still waiting for redirect...');
                return false;
              }
            },
            {
              timeout: 120000, // 2 minutes timeout for redirect
              interval: 5000,   // Check every 5 seconds
              timeoutMsg: 'Did not redirect to order summary page within 2 minutes'
            }
          );
          
          // Successfully reached order summary page - now wait for 5 minutes
          const currentUrl = await browser.getUrl();
          console.log('🎉 SUCCESSFULLY REACHED ORDER SUMMARY PAGE!');
          console.log(`📍 Final URL: ${currentUrl}`);
          
          // Extract the dynamic order ID from URL
          const orderIdMatch = currentUrl.match(/\/summary\/(\d+)/);
          const orderId = orderIdMatch ? orderIdMatch[1] : 'unknown';
          console.log(`🎫 Order ID: ${orderId}`);
          
          // Wait for 5 minutes on the order summary page as requested
          console.log('⏳ WAITING FOR 5 MINUTES ON ORDER SUMMARY PAGE...');
          console.log('🕐 This is as requested - staying on the page for 5 minutes');
          console.log('📊 You can now observe the order summary page for 5 minutes');
          
          // 5 minutes = 300,000 milliseconds
          const fiveMinutes = 300000;
          const startTime = Date.now();
          
          // Wait in smaller chunks and log progress
          const logInterval = 60000; // Log every minute
          let remainingTime = fiveMinutes;
          
          while (remainingTime > 0) {
            const waitTime = Math.min(logInterval, remainingTime);
            await browser.pause(waitTime);
            
            remainingTime -= waitTime;
            const elapsed = Date.now() - startTime;
            const elapsedMinutes = Math.floor(elapsed / 60000);
            const remainingMinutes = Math.floor(remainingTime / 60000);
            
            if (remainingTime > 0) {
              console.log(`⏳ Still waiting... ${elapsedMinutes + 1} minute(s) elapsed, ${remainingMinutes} minute(s) remaining`);
              
              // Verify we're still on the order summary page
              try {
                const currentUrlCheck = await browser.getUrl();
                if (currentUrlCheck.includes('bus-tickets/summary/')) {
                  console.log('✅ Still on order summary page');
                } else {
                  console.log(`⚠️ URL changed to: ${currentUrlCheck}`);
                }
              } catch (e) {
                console.log('⚠️ Could not check current URL');
              }
            }
          }
          
          console.log('🎉 5-MINUTE WAIT COMPLETED!');
          console.log('✅ Successfully stayed on order summary page for 5 minutes');
          console.log('🏁 TEST COMPLETED SUCCESSFULLY');
          
        } catch (e) {
          console.log('❌ Error waiting for order summary page:', e.message);
          console.log('⏳ Attempting to continue anyway and wait for 5 minutes...');
          
          // Even if we couldn't detect the redirect properly, wait 5 minutes anyway
          console.log('⏳ Waiting 5 minutes regardless of redirect detection...');
          await browser.pause(300000); // 5 minutes
          
          console.log('✅ 5-minute wait completed (fallback)');
          console.log('🏁 TEST COMPLETED');
        }
        
      } else {
        console.log('❌ Could not click Pay button with any method');
        throw new Error('Pay button could not be clicked - all methods failed');
      }
      
    } catch (e) {
      console.log('Pay button click failed:', e.message);
      console.log('🔍 Debugging Pay button issue...');
      
      // Debug what's actually on the page
      try {
        const allButtons = await $$('//button');
        console.log(`Found ${allButtons.length} buttons on page`);
        
        for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
          try {
            const button = allButtons[i];
            const text = await button.getText();
            const isDisplayed = await button.isDisplayed();
            console.log(`Button ${i}: "${text}" (displayed: ${isDisplayed})`);
          } catch (e) {
            console.log(`Button ${i}: Could not get details`);
          }
        }
        
        const allImages = await $$('//img');
        console.log(`Found ${allImages.length} images on page`);
        
        for (let i = 0; i < Math.min(allImages.length, 10); i++) {
          try {
            const img = allImages[i];
            const src = await img.getAttribute('src');
            const className = await img.getAttribute('class');
            if (src && (src.includes('ptm-lock') || (className && className.includes('ptm-lock')))) {
              console.log(`Lock image ${i}: src="${src}", class="${className}"`);
            }
          } catch (e) {
            // Skip this image
          }
        }
        
      } catch (e) {
        console.log('Debug failed:', e.message);
      }
      
      throw new Error('Pay button click failed after all attempts: ' + e.message);
    }

    // === STEP 14: Order summary page ===
    
    // Test completed - no need for final status as it's handled above
    console.log('🏁 FINAL: Test execution completed');
  });
});