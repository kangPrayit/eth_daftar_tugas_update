App = {
    loading: false,
    contracts: {},

    load: async ()=> {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async()=> {
        if(typeof window.ethereum !== 'undefined'){
            App.web3Provider = window.ethereum
        } else {
            // jika tidak ada maka diminta untuk menginstal aplikasi metamask
            document.getElementById('log').innerHTML = 'Please install metamask';
        }
    },
    loadAccount: async()=> {
        App.account = await window.ethereum.request({method: 'eth_accounts'});
        console.log(App.account);
    },
    loadContract: async()=> {
        const daftarTugas = await $.getJSON('DaftarTugas.json');
        App.contracts.DaftarTugas = TruffleContract(daftarTugas);
        App.contracts.DaftarTugas.setProvider(App.web3Provider);
        App.daftarTugas = await App.contracts.DaftarTugas.deployed();
    },
    render: async()=> {
        if(App.loading){
            return
        }
        App.setLoading(true)
        $('#account').html(App.account[0])

        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async ()=> {
        const jumlahTugas = await App.daftarTugas.jumlahTugas()
        const $taskTemplate = $('.taskTemplate')

        for(var i=1; i <= jumlahTugas; i++){
            const tugas = await App.daftarTugas.daftarTugas(i)
            const taskId = tugas[0].toNumber()
            const taskContent = tugas[1]
            const taskCompleted = tugas[2]
            
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted)

            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
            $newTaskTemplate.show()
        }
    },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.daftarTugas.buatTugas(content, {from:App.account[0]})
        window.location.reload()
      },
    
    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskId = e.target.name
        await App.daftarTugas.tugasSelesai(taskId, {from:App.account[0]})
        window.location.reload()
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if(boolean){
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}

$(document).ready(function(){
    App.load()
    ethereum.on('accountsChanged', function(accounts){
        window.location.reload()
    })
})