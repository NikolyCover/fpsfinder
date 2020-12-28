import React, { useState, useEffect } from 'react'

import api from '../../services/api'

import PopUp from '../../components/PopUp/PopUp'
import SelectInput from '../../components/SelectInput/SelectInput'
import GameContainer from '../../components/GameContainer/GameContainer'
import Footer from '../../components/Footer/Footer'

import FPSFinderLogo from '../../assets/images/logo.svg'
import graphicCardImage from '../../assets/images/graphic-card.svg'
import processorImage from '../../assets/images/processor.svg'
import ramMemoryImage from '../../assets/images/ram-memory.svg'
import motherboardImage from '../../assets/images/motherboard.svg'

import './styles.css'


const Home = () => {
    const [ currentPopUp, setCurrentPopUp ] = useState({ id: 0, isVisible: false })
    const [ resultContainer, setResultContainer ] = useState(false)
    const [ games, setGames ] = useState([])

    const [ filteredCombination, setFilteredCombination ] = useState({})

    const [ selectedGraphicCard, setSelectedGraphicCard ] = useState(0)
    const [ selectedProcessor, setSelectedProcessor ] = useState(0)
    const [ selectedRamMemory, setSelectedRamMemory ] = useState(0)

    const [ graphicCardOptions, setGraphicCardOptions ] = useState([])
    const [ processorOptions, setProcessorOptions ] = useState([])
    const [ ramMemoryOptions, setRamMemoryOptions ] = useState([])

    const isValid = (value) => Number(value) !== 0 

    useEffect(() => {
        api.get('combinations', { params: { components: {} } }).then(response => {
            const combination = response.data

            setGraphicCardOptions(combination['graphic_card'])
            setProcessorOptions(combination['processor'])
            setRamMemoryOptions(combination['ram_memory'])        
        })  

        api.get('games', { params: { name: "" } }).then(response => {
            const receveidGames = response.data

            setGames(receveidGames)
        })
    }, [  ])

    useEffect(() => {
        const filterOption = {}
        const components = [{graphic_card: selectedGraphicCard}, {processor: selectedProcessor}, {ram_memory: selectedRamMemory}]

        components.forEach(component => {
            const [ key ] = Object.keys(component)
    
            if(isValid(component[key])) filterOption[key] = component[key]
        })

        if(Object.keys(filterOption).length === 3){
            api.get('combinations', { params: { components: { ...filterOption } } }).then(response => {
                const [ combination ] = response.data

                setFilteredCombination(combination)
            })
        }
        else {
            api.get('combinations', { params: { components: { ...filterOption } } }).then(response => {
                const { graphic_card, processor, ram_memory } = response.data

                if(isValid(graphic_card.length)) setGraphicCardOptions(graphic_card)
                if(isValid(processor.length)) setProcessorOptions(processor)
                if(isValid(ram_memory.length)) setRamMemoryOptions(ram_memory)
            })
        }
    }, [ selectedGraphicCard, selectedProcessor, selectedRamMemory ])

    const handleCurrentPopUpVisibility = event => {
        const status = !currentPopUp.isVisible
        const id = status ? event.target.id : 0

        if(status){
            window.scrollTo(0, 0)
            document.body.style.overflow = 'hidden'
        }
        else {
            document.body.style.overflow = 'initial'
        }

        setCurrentPopUp({ id, isVisible: status })
    }

    const clearSelectFields = () => {
        setSelectedGraphicCard(0)
        setSelectedProcessor(0)
        setSelectedRamMemory(0)
    }

    const handleCalculateAgain = () => {
        const link = document.createElement('a')
        link.href = '#calculate'

        link.click()
        
        setResultContainer(false)
        setFilteredCombination({})
        clearSelectFields()  
    }

    const handleProcessorChange = event => {
        const processor = event.target.value

        setSelectedProcessor(processor)

        isValid(event.target.value) && setProcessorOptions([event.target.value])
    }

    const handleRamMemoryChange = event => {
        const ramMemory = event.target.value

        setSelectedRamMemory(ramMemory)
        
        isValid(event.target.value) && setRamMemoryOptions([event.target.value])
    }

    const handleGraphicCardChange = event => {
        const graphicCard = event.target.value
        
        setSelectedGraphicCard(graphicCard)

        isValid(event.target.value) && setGraphicCardOptions([event.target.value])
    }

    const handleResultContainerView = () => {
        if(!isValid(selectedGraphicCard) || !isValid(selectedProcessor) || !isValid(selectedRamMemory)) return

        setResultContainer(true)

        const link = document.createElement('a')
        link.href = `#result`
        link.click()  
    }

    return (
        <div className="Home">
            <header className="main-header">
                <nav className="nav-bar">
                    <img src={FPSFinderLogo} alt="FPS Finder"/>
                </nav>
                <section className="presentation">
                    <h2>Calcule agora a média de FPS em jogos que sua máquina é capaz de alcançar! </h2>
                    <p>Através de pesquisas e testes a nossa calculadora é capaz de juntar as informações básicas de sua máquina, dadas por você, e calcular a média de FPS em que ela alcança em jogos selecionados.</p>
                </section>
            </header>

            <div className="section-title" id="calculate">
                <h1>CALCULAR</h1>
            </div>

            <main className="input-section">
                <div>
                    <SelectInput 
                        label="Placa de Vídeo"
                        selectedOption={selectedGraphicCard}
                        options={graphicCardOptions} 
                        popUpID="graphic-card"
                        handlePopUp={handleCurrentPopUpVisibility}
                        handleSelectChange={handleGraphicCardChange}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'graphic-card') &&
                        
                        <PopUp closePopUp={handleCurrentPopUpVisibility} isVisible={currentPopUp.isVisible}>
                            <section className="popup-title">
                                <img src={graphicCardImage} alt="Placa Gráfica"/>
                                <h2>Placa Gráfica</h2>
                            </section>
                            <main>
                                <p>
                                A placa de vídeo é um dos principais componentes de qualquer pc, principalmente se seu foco é rodar jogos. A placa de vídeo é a peça responsável por gerar as imagens que você vê na tela.</p> 
                            </main>
                        </PopUp>
                    }
                </div>
                <div>
                    <SelectInput 
                        label="Processador" 
                        selectedOption={selectedProcessor} 
                        options={processorOptions} 
                        popUpID="processor"
                        handlePopUp={handleCurrentPopUpVisibility}
                        handleSelectChange={handleProcessorChange}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'processor') &&
                        
                        <PopUp closePopUp={handleCurrentPopUpVisibility} isVisible={currentPopUp.isVisible}>
                            <section className="popup-title">
                                <img src={processorImage} alt="Processador"/>
                                <h2>Processador</h2>
                            </section>
                            <main>
                                <p>O processador é basicamente o cérebro de sua máquina. A função dele é acelerar, enviar, resolver ou preparar dados para os outros componentes do computador. </p> 
                            </main>
                        </PopUp>
                    }
                </div>
                <div>
                    <SelectInput 
                        label="Memória RAM" 
                        selectedOption={selectedRamMemory} 
                        options={ramMemoryOptions}
                        popUpID="ram-memory"
                        handlePopUp={handleCurrentPopUpVisibility} 
                        handleSelectChange={handleRamMemoryChange}
                    />

                    {(currentPopUp.isVisible && currentPopUp.id === 'ram-memory') &&
                        
                        <PopUp closePopUp={handleCurrentPopUpVisibility} isVisible={currentPopUp.isVisible}>
                            <section className="popup-title">
                                <img src={ramMemoryImage} alt="Memória RAM"/>
                                <h2>Memória RAM</h2>
                            </section>
                            <main>
                                <p> A memória Ram é um componente que “conversa” com o processador e recebe os dados temporários de sua máquina, diferente do HD, que não é feito para dados temporários e é muito mais lento.</p> 
                            </main>
                        </PopUp>
                    }
                </div>

                <section className="operations-buttons">
                    <button className="btn main" onClick={handleResultContainerView}>Calcular</button>
                    <button className="btn" onClick={clearSelectFields}>Limpar campos</button>
                </section>
            </main>

            {resultContainer &&
                <>
                    <div className="section-title" id="result">
                        <h1>RESULTADO</h1>
                    </div>

                    <section className="filter-combination" id="filter-combination">
                        <h2>Peças escolhidas: </h2>

                        <div className="filter-components">
                            <ul>
                                <li><span>Placa de Vídeo: </span>{filteredCombination.graphic_card}</li>
                                <li><span>Processador: </span>{filteredCombination.processor}</li>
                                <li><span>Memória RAM: </span>{filteredCombination.ram_memory}</li>
                            </ul>
                        </div>
                    </section>

                    <section className="motherboard">
                        <h2>Placa Mãe recomendada: </h2>

                        <div className="motherboard-box">
                            <img src={motherboardImage} alt="Placa Mãe recomendada"/>
                            <p>{filteredCombination.motherboard}</p>
                        </div>
                    </section>

                    <section className="games-container">
                        <h2>Jogos:</h2>

                        <div className="games-list">
                            {filteredCombination.FPSAverages.map(item => {
                                const [ game ] = games.filter(game => game.id === item.id_game)

                                return (
                                    <GameContainer name={game.name} URLLogo={game.url_logo} FPSAverage={item.fps_average} key={game.id}/>
                                )
                            })}
                        </div>
                    </section>

                    <div className="btn-again">
                        <button className="btn main" onClick={handleCalculateAgain}>Calcular Novamente</button>
                    </div>
                </>
                    
            }

            <Footer />
        </div>
    )
}

export default Home

//