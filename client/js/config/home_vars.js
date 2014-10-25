window.Menu_items = [
  {
      name:'Product',
      id:'product',
      parallax_height: '80%',
      parallax_template: 'menu_item_parallax',
      right_template: get_dynamic_template('section_title',{section_name:'Product'}),
      left_template: get_dynamic_template('section_banner',
        {messages:[{line:true,m:'Digital screens can detect who is in front of them.'},{m:'Retail stores can deliver relevant content in Real-Time.'}]}
      ),
      content_template: get_dynamic_template('product',{})
  },
  {
      name:'Teaser',
      id:'tryit',
      parallax_height: '0%',
      parallax_template: 'menu_item_parallax',
      is_link: '/dashboard',
      //left_template: get_dynamic_template('section_title',{section_name:'Try it'}),
      
      //content_template: get_dynamic_template('tryit',{})
  },
  /**{
      'name':'How it works',
      id:'how_it_works',
      parallax_height: '80%',
      parallax_template: 'menu_item_parallax',
      left_template: get_dynamic_template('section_title',{section_name:'How it works'}),
      content_template: get_dynamic_template('how_it_works',
        {
          section_name:'How it works',
          step1: {
            step: '1',
            text: 'Images are captured and analyzed by the RLA Device using facial detection technology to obtain detailed insights about who is currently in view of the billboard.'
          },
          step2: {
            step: '2',
            text: 'Each Billboard queries our servers for the most effective advertising to display based on the parameters set up by the marketers and advertisers.'
          },
          step3: {
            step: '3',
            text: 'Marketers are then only charged for the time their advertisement is displayed and for the number of actual views by their selected audience.'
          }
        }
      ),
  },*/
  {
      name:'Pricing',
      id:'pricing',
      parallax_height: '70%',
      parallax_template: 'menu_item_parallax',
      right_template: get_dynamic_template('section_title',{section_name:'Pricing'}),
      content_template: get_dynamic_template('pricing',
        { 
          section_name:'Pricing',
          owners: {
            step: 'Basic - $100/month',
            icon: 'fui-user',
            text: 'Detect Age, gender, engament and deliver real-time targeted ads via Dashboard and Analytics'
          },
          adverts: {
            step: 'Custom',
            icon: 'fui-chat',
            text: "Detect Age, gender, engament, clothing, expresions, size, height and deliver real-time targeted ads via Dashboard and Analytics"
          }
        }
      ),
  },
  {
      name:'Contact Us',
      id:'join_us',
      //is_button: true,
      parallax_height: '50%',
      parallax_template: 'menu_item_parallax',
      left_template: get_dynamic_template('section_title',{section_name:'Contact Us'}),
      content_template: get_dynamic_template('join_us',
        { 
          
          
          questions: {
            step: 'Questions?',
            icon: 'fui-mail',
            text: "If you want to contact us directly or if you have any questions, we will be happy to hear about you. Please write to: sales@reallifeanalytics.com"
          }
        }
      ),
  }
];

window.parallax_items = [ 
  {
      id: 'one_liner',
      parallax_height: '80%',
      parallax_template: 'one_liner_parallax',

  }
];


parallax_items = parallax_items.concat(Menu_items);