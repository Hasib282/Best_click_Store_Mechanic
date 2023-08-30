import { Injectable } from "@nestjs/common";
import { CustomerDTO, CustomerLoginDTO, CustomerUpdateDTO, CustomerUpdatePassDTO } from "./Customer DTO/customer.DTO";
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "./CustomerEntity/customer.entity";
import { Repository } from "typeorm";
import { ChatEntity } from "../mechanic/MechanicEntity/chat.entity";
import { MechanicEntity } from "../mechanic/MechanicEntity/mechanic.entity";
import { ChatDTO } from "./Customer DTO/chat.DTO";
import { ServiceRequestEntity } from "../mechanic/MechanicEntity/serviceRequest.entity";


@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(CustomerEntity) private customerRepo: Repository<CustomerEntity>,
        @InjectRepository(MechanicEntity) private mechanicRepo: Repository<MechanicEntity>,
        @InjectRepository(ServiceRequestEntity) private serviceRequestRepo: Repository<ServiceRequestEntity>,
        @InjectRepository(ChatEntity) private chatRepo: Repository<ChatEntity>,
    ) {}

    /////////////////////////////////////// Customer Registration part start here ///////////////////////////////////

    //Customer Registration
    async addCustomer(data: CustomerDTO) {
        //hasshing the password
        const pass = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, pass);

        return await this.customerRepo.save(data);
    }

    //check Email
    async checkEmail(email) {
        return this.customerRepo.findOneBy({ email: email })
    }


    ///////////////////////////////////// Customer Registration part end here ////////////////////////////////////////////



    //////////////////////////////////// Customer Login part start here /////////////////////////////////////////////////

    //Customer Login
    async customerLogin(data: CustomerLoginDTO) {
        const profile = await this.getCustomer(data.email);
        const ismatch: boolean = await bcrypt.compare(data.password, profile.password);
        if (ismatch) {
            return ismatch;
        }
        else {
            return false;
        }
    }

    /////////////////////////////////// Customer Login Part start here //////////////////////////////////////////////////


    /////////////////////////////////// Customer Profile part start here ////////////////////////////////////////////////

    //Show all customer
    async getAllCustomer() {
        return this.customerRepo.find();
    }


    //Show Customer Profile by email
    async getCustomer(email) {
        return this.customerRepo.findOneBy({ email: email });
    }


    //Show customer by id
    async getCustomerById(id) {
        return this.customerRepo.findOneBy({ id: id });
    }


    //update Customer Profile
    async updateCustomer(id, data: CustomerUpdateDTO) {
        return this.customerRepo.update(id, data);
    }



    //verify Customer password
    async verifyPassword(id, data: CustomerUpdatePassDTO): Promise<any> {
        const profile = await this.customerRepo.findOneBy({ id });
        const isMatch: boolean = await bcrypt.compare(data.old_password, profile.password);
        if (isMatch) {
            return isMatch;
        }
        else {
            return false;
        }
    }


    //Update Customer password
    async changePassword(id, password): Promise<any> {
        const pass = await bcrypt.genSalt();
        password = await bcrypt.hash(password, pass);
        return this.customerRepo.update(id, { password: password });
    }


    //Delete Customer Profile
    async deleteCustomer(id) {
        return this.customerRepo.delete(id);
    }
    


    ///////////////////////////////// Customer Profile part end here //////////////////////////////////////////////////////


    /////////////////////////////////// Display mechanic part start here ///////////////////////////////////////////////////

    //Show mechanic by id
    async getMechanicById(id) {
        return this.mechanicRepo.findOneBy({ mechanic_id: id });
    }


    ///////////////////////////////////// Display mechanic part end here /////////////////////////////////////////////////////


    //////////////////////////////////// Customer request for service part start /////////////////////////////////////////

    //Customer send request for getting service
    async addServiceRequest(customerid, data) {
        const servicerequest = new ServiceRequestEntity();
        servicerequest.mechanic = data.mechanicid;
        servicerequest.customer = customerid;
        servicerequest.service = data.serviceid;
        return this.serviceRequestRepo.save(servicerequest);
    }


    //Show customer service requests
    async getCustomerRequestService() {
        return this.customerRepo.find({ relations: { request: { customer: true, mechanic: true, service: true } } });
    }


    /////////////////////////////////// Customer request for service part end ///////////////////////////////////////////



    //////////////////////////////// Customer Chat part start here //////////////////////////////////////////////////////

    //Customer Send Message
    async customerSendMessage(customerid, mechanicid, message: ChatDTO) {
        const chat = new ChatEntity();
        chat.message = message.message;
        chat.sendercustomer = customerid;
        chat.receivermechanic = mechanicid;
        return this.chatRepo.save(chat);
    }


    //Show customer send and received chats
    async showCustomerChat(id) {
        return this.customerRepo.find({
            select: { name: true },
            where: { id: id },
            relations: {
                sendmessage: {
                    receivermechanic: { profile: true },
                },
                receivemessage: { sendermechanic: true },
            }
        })
    }
    
    //////////////////////////////// Customer Chat part end here //////////////////////////////////////////////////////

}