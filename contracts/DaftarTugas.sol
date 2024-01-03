// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DaftarTugas {
    uint public jumlahTugas = 0;

    struct Tugas {
        uint id;
        string isiTugas;
        bool isSelesai;
    }
    mapping(uint => Tugas) public daftarTugas;

    event TugasDibuat(uint id, string isiTugas, bool isSelesai);

    function buatTugas(string memory _isiTugas) public {
        jumlahTugas++;
        daftarTugas[jumlahTugas] = Tugas(jumlahTugas, _isiTugas, false);
        emit TugasDibuat(jumlahTugas, _isiTugas, false);
    }

    event eventTugasSelesai(uint id, bool isSelesai);

    function tugasSelesai(uint _id) public {
        Tugas memory _tugas = daftarTugas[_id];
        _tugas.isSelesai = !_tugas.isSelesai;
        daftarTugas[_id] = _tugas;
        emit eventTugasSelesai(_id, _tugas.isSelesai);
    }
}
