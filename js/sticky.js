(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
	let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [
		{
			// 1
			type: 'normal',
			//heightNum: 5, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
                container: document.querySelector('#section1'),
				content: document.querySelector('#section1 .description')
			},
			values: {
			}
		},
		{
			// 2
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
                container: document.querySelector('#section2'),
                imgBg: document.querySelector('#section2 .back_img'),
				messageA: document.querySelector('#section2 .main_message.a'),
				messageB: document.querySelector('#section2 .main_message.b'),
				messageC: document.querySelector('#section2 .main_message.c'),
				messageD: document.querySelector('#section2 .main_message.d'),
			},
			values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                imgBg_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageA_opacity_in: [0, 1, { start: 0.0, end: 1 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                imgBg_opacity_out: [1, 0, { start: 1, end: 0 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                imgBg_translateY_out: [0, -5500, { start: 0, end: 1 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
		},
		{
			// 3
			type: 'normal',
			//heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
                container: document.querySelector('#section3'),
                content: document.querySelector('#section3 .description')
				//messageA: document.querySelector('#section3 .main_message.a'),
				//messageB: document.querySelector('#section3 .main_message.b')
			},
			values: {
			}
		},
		{
			// 4
			type: 'normal',
			//heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
                container: document.querySelector('#section4'),
                content: document.querySelector('#section4 .description')
				//messageA: document.querySelector('#section4 .main_message.a'),
				//messageB: document.querySelector('#section4 .main_message.b')
			},
			values: {
			}
		},
		{
			// 5
			type: 'normal',
			//heightNum: 5, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
                container: document.querySelector('#section5'),
				content: document.querySelector('#section5 .description')
			},
			values: {
			}
		}
	];

    function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
        console.log(sceneInfo);
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal')  {
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
			}
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}

		yOffset = window.pageYOffset;

		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);

		//const heightRatio = window.innerHeight / 1080;
		//sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
		//sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
	}

	function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
        //console.log("calcValues");

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
            //console.log("calcValues -if");
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

       //console.log("rv : " + rv)
		return rv;
	}

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        // currentYOffset 현재 씬의 스크롤 위치 / scrollHeight 현재 씬의 스크롤 범위 >> 스크롤 비율
        const scrollRatio = currentYOffset / scrollHeight; 
        //console.log(currentScene, currentYOffset);
        //console.log( objs );
        //console.log( scrollRatio );

        switch( currentScene) {
            case 0: 
                console.log('1play');                    
                break;
            case 1:
                console.log('2play');
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				//objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                console.log("scrollRatio : " +scrollRatio);
                objs.imgBg.classList.add('sticky_bg');
                objs.imgBg.style.clipPath = "inset(" + (101 - (scrollRatio*101)) + "% 0 0)";
                document.querySelector('#section2 .back_img').style.top = '0px'

                if(scrollRatio <= 0.5) {
                    objs.imgBg.style.opacity = calcValues(values.imgBg_opacity_in, currentYOffset);
                } else {
                    objs.imgBg.style.opacity = calcValues(values.imgBg_opacity_out, currentYOffset);
                }

				if (scrollRatio <= 0.22) {
					// in
                    //console.log("111 in");
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
                    //console.log("111 out");
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}         
                break;
            case 2:
                console.log('3play');     
                //document.querySelector('#section2 .back_img').classList.remove('sticky_bg');    
                //document.querySelector('#section2 .back_img').style.transform = `translate3d(0, ${calcValues(sceneInfo[1].values.imgBg_translateY_out, currentYOffset)}%, 0)`;
                //document.querySelector('#section2 .back_img').style.clipPath = "inset(0% 0 0)";
                //document.querySelector('#section2 .back_img').style.top = `${-sceneInfo[currentScene].scrollHeight}px`;
                break;
            case 3:
                console.log('4play');              
                break;
            case 4:
                console.log('5play');              
                break;
        }
    }

    function scrollLoop() {
        //console.log("currentScene : " + currentScene);
        //console.log(sceneInfo[currentScene]);
		enterNewScene = false;
		prevScrollHeight = 0;

		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

        if (yOffset > prevScrollHeight+sceneInfo[currentScene].scrollHeight) {            
            currentScene++;
            enterNewScene = true;
            document.body.setAttribute('id', `show_scene_${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            if(currentScene == 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentScene--;
            enterNewScene = true;
            document.body.setAttribute('id', `show_scene_${currentScene}`);
        }        


		if (enterNewScene) return;

		playAnimation();
	}

    window.addEventListener('load', () => {
        setLayout();
    });
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
       scrollLoop();      
    });






})();



